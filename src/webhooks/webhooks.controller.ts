import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import Stripe from 'stripe'
import { UpdateWebhookDto } from './dto/update-webhook.dto'
import { WebhooksService } from './webhooks.service'
import { StripeWebhookHandler } from '@golevelup/nestjs-stripe'

@Controller('webhook')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @StripeWebhookHandler('checkout.session.completed')
  @Post()
  handleSessionCompleted(@Body() event: Stripe.CheckoutSessionCompletedEvent) {
    console.log('Session Completed:', event.data.object.metadata)
  }

  @StripeWebhookHandler('checkout.session.expired')
  @Post()
  handleSessionExpired(@Body() event: Stripe.CheckoutSessionExpiredEvent) {
    console.log('Session Expired:', event)
  }

  @Get()
  findAll() {
    return this.webhooksService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webhooksService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhooksService.update(+id, updateWebhookDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webhooksService.remove(+id)
  }
}
