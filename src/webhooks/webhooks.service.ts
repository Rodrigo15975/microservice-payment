import { Injectable, Logger } from '@nestjs/common'
import Stripe from 'stripe'
import { UpdateWebhookDto } from './dto/update-webhook.dto'
import { StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import { ProductsService } from 'src/products/products.service'
import { OrdersService } from 'src/orders/orders.service'

@Injectable()
export class WebhooksService {
  private readonly logger: Logger = new Logger(WebhooksService.name)

  constructor(
    private readonly productService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  @StripeWebhookHandler('checkout.session.completed')
  handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
    const { metadata } = event.data.object
    this.productService.decrementStock(metadata)
    this.ordersService.create(metadata)
    this.logger.debug('Payment completed')
  }

  @StripeWebhookHandler('checkout.session.expired')
  handleSessionExpired(event: Stripe.CheckoutSessionExpiredEvent) {
    console.debug('expirated:', event)
  }

  findAll() {
    return `This action returns all webhooks`
  }

  findOne(id: number) {
    return `This action returns a #${id} webhook`
  }

  update(id: number, updateWebhookDto: UpdateWebhookDto) {
    console.log({
      updateWebhookDto,
    })

    return `This action updates a #${id} webhook`
  }

  remove(id: number) {
    return `This action removes a #${id} webhook`
  }
}
