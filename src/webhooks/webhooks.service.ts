import { StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import { Injectable, Logger } from '@nestjs/common'
import { OrdersService } from 'src/orders/orders.service'
// import { ProductsService } from 'src/products/products.service'
import Stripe from 'stripe'

@Injectable()
export class WebhooksService {
  private readonly logger: Logger = new Logger(WebhooksService.name)

  constructor(
    // private readonly productService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  @StripeWebhookHandler('checkout.session.completed')
  handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
    const statusPayment = event.data.object.payment_status
    const { metadata } = event.data.object
    // this.productService.decrementStock({ ...metadata, statusPayment })
    this.ordersService.create({ ...metadata, statusPayment })
    this.logger.debug('Payment completed')
  }

  @StripeWebhookHandler('checkout.session.expired')
  handleSessionExpired(event: Stripe.CheckoutSessionExpiredEvent) {
    console.debug('expirated:', event)
  }

  @StripeWebhookHandler('checkout.session.async_payment_failed')
  handleSessionFailed(event: Stripe.CheckoutSessionExpiredEvent) {
    console.debug('failed:', event)
  }

  @StripeWebhookHandler('checkout.session.async_payment_succeeded')
  handleSessionPaymentSucceeded(event: Stripe.CheckoutSessionExpiredEvent) {
    console.debug('failed:', event)
  }
}
