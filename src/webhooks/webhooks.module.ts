import { Module } from '@nestjs/common'
import { WebhooksService } from './webhooks.service'
import { WebhooksController } from './webhooks.controller'
import { ConfigService } from '@nestjs/config'
import { StripeModule } from '@golevelup/nestjs-stripe'

@Module({
  imports: [
    StripeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
        webhookConfig: {
          stripeSecrets: {
            account: configService.getOrThrow<string>(
              'STRIPE_WEBHOOK_SECRET_ACCOUNT',
            ),
          },
          requestBodyProperty: 'rawBody',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
