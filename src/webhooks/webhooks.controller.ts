import { StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import { Body, Controller, Post } from '@nestjs/common'
import Stripe from 'stripe'
import { WebhooksService } from './webhooks.service'

@Controller('webhook')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @StripeWebhookHandler('checkout.session.completed')
  @Post()
  handleSessionCompleted(@Body() event: Stripe.CheckoutSessionCompletedEvent) {
    console.debug('type:', event.type)
    return this.webhooksService.handleCheckoutSessionCompleted(event)
  }
}
