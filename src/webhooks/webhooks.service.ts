import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { UpdateWebhookDto } from './dto/update-webhook.dto'

@Injectable()
export class WebhooksService {
  // @StripeWebhookHandler('checkout.session.completed')
  handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
    console.debug('completed:', event)
  }

  // @StripeWebhookHandler('checkout.session.expired')
  handledSessionTest(event: Stripe.CheckoutSessionExpiredEvent) {
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
