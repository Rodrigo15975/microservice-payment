import { StripeModule } from '@golevelup/nestjs-stripe'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WebhooksController } from './webhooks.controller'
import { WebhooksService } from './webhooks.service'
import { OrdersModule } from 'src/orders/orders.module'

@Module({
  imports: [
    OrdersModule,
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
