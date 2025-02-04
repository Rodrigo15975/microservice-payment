import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable, Logger } from '@nestjs/common'
import Stripe from 'stripe'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import {
  AmqpConnection,
  RabbitPayload,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq'
import { configRabbit } from './common/config-rabbit'
import { randomUUID } from 'crypto'

@Injectable()
export class PaymentService {
  private readonly orderId = randomUUID().toString()
  private readonly logger: Logger = new Logger(PaymentService.name)
  constructor(
    @InjectStripeClient() private readonly stripeClient: Stripe,
    private readonly amqAconnection: AmqpConnection,
  ) {}

  @RabbitRPC({
    exchange: configRabbit.ROUTING_EXCHANGE_CREATE_PAYMENT,
    routingKey: configRabbit.ROUTING_ROUTINGKEY_CREATE_PAYMENT,
    queue: configRabbit.ROUTING_QUEUE_CREATE_PAYMENT,
    name: configRabbit.ROUTING_QUEUE_CREATE_PAYMENT,
  })
  async create(@RabbitPayload() data: CreatePaymentDto) {
    this.logger.verbose('Initial payment... ')
    const { dataFormat, emailUser, idUser, totalPrice } = data
    this.logger.debug(dataFormat)
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
              images: item.productVariant.map(({ url }) => url.trim()),
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
    })
    this.logger.verbose('Publish order for create in DB-CLIENT-ORDER... ')
    this.publishOrdersClient(data)
    this.logger.verbose('Final payment... ')
    return {
      sessionId: session.id,
      url: session.url,
    }
  }

  private publishOrdersClient(data: CreatePaymentDto) {
    this.amqAconnection.publish(
      configRabbit.ROUTING_EXCHANGE_GET_ALL_ORDERS,
      configRabbit.ROUTING_ROUTINGKEY_GET_ALL_ORDERS,
      data,
    )
  }

  private async createSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    metadata: {
      userId: string
      productIds: string
      amount_total: number
      orderId: string
      emailUser: string
    },
  ) {
    const { amount_total, orderId, productIds, userId, emailUser } = metadata

    const sesion = await this.stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // agregar url de redireccion de sucess y cancel
      success_url: 'http://localhost:3000/products',
      cancel_url: 'http://localhost:3000/',
      customer_email: emailUser,
      metadata: {
        userId,
        emailUser,
        productIds,
        amount_total,
        orderId,
      },
      currency: 'usd',
    })
    return sesion
  }

  findAll() {
    console.log({
      message: 'hola',
    })

    return `This action returns all payment`
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    console.log({
      updatePaymentDto,
    })

    return `This action updates a #${id} payment`
  }

  remove(id: number) {
    return `This action removes a #${id} payment`
  }
}
