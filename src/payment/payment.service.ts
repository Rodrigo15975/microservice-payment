import {
  AmqpConnection,
  RabbitPayload,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq'
import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable, Logger } from '@nestjs/common'
import { randomUUID } from 'crypto'
import Stripe from 'stripe'
import { configRabbit } from './common/config-rabbit'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentService {
  private readonly orderId = randomUUID().toString()
  private readonly logger: Logger = new Logger(PaymentService.name)
  constructor(
    @InjectStripeClient() private readonly stripeClient: Stripe,
    private readonly amqAconnection: AmqpConnection,
  ) {
    this.logger.debug(
      'SUCCESS_URL',
      process.env.NODE_ENV === 'production'
        ? process.env.SUCCESS_URL
        : process.env.SUCCESS_URL,
    )
  }

  @RabbitRPC({
    exchange: configRabbit.ROUTING_EXCHANGE_CREATE_PAYMENT,
    routingKey: configRabbit.ROUTING_ROUTINGKEY_CREATE_PAYMENT,
    queue: configRabbit.ROUTING_QUEUE_CREATE_PAYMENT,
    name: configRabbit.ROUTING_QUEUE_CREATE_PAYMENT,
  })
  async create(@RabbitPayload() data: CreatePaymentDto) {
    this.logger.verbose('Initial payment... ')
    const { dataFormat, emailUser, idUser, totalPrice, codeUsed } = data
    const originalTotalPrice = dataFormat.reduce(
      (total, item) => total + item.price * item.quantity_buy,
      0,
    )

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      dataFormat.map((item) => {
        const itemProportion =
          (item.price * item.quantity_buy) / originalTotalPrice
        const unitAmount = (totalPrice * itemProportion) / item.quantity_buy
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              images: item.productVariant.map((i) => i.url.trim()),
              name: item.product,
              description: item.brand,
            },
            unit_amount: Math.round(unitAmount * 100),
          },
          quantity: item.quantity_buy,
        }
      })

    const session = await this.createSession(lineItems, {
      amount_total: totalPrice,
      emailUser,
      orderId: this.orderId,
      productIds: JSON.stringify(
        dataFormat
          .map((item) => item.id)
          .join(',')
          .split(','),
      ),
      userId: idUser,
      codeUsed: JSON.stringify(codeUsed),
    })
    this.logger.verbose('Publish order for create in DB-CLIENT-ORDER... ')
    this.publishOrdersClient(data)
    this.logger.verbose('Final payment... ')
    return {
      sessionId: session.id,
      url: session.url,
    }
  }

  private async createSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    metadata: {
      userId: string
      productIds: string
      amount_total: number
      orderId: string
      emailUser: string
      codeUsed: string
    },
  ) {
    const { amount_total, orderId, productIds, userId, emailUser, codeUsed } =
      metadata

    const sesion = await this.stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/orders',
      cancel_url: 'http://localhost:3000/',
      customer_email: emailUser,
      metadata: {
        userId,
        emailUser,
        productIds,
        amount_total,
        orderId,
        codeUsed,
      },
      currency: 'usd',
    })
    return sesion
  }
  private publishOrdersClient(data: CreatePaymentDto) {
    this.amqAconnection.publish(
      configRabbit.ROUTING_EXCHANGE_GET_ALL_ORDERS,
      configRabbit.ROUTING_ROUTINGKEY_GET_ALL_ORDERS,
      data,
    )
  }
}
