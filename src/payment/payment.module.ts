import { StripeModule } from '@golevelup/nestjs-stripe'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
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
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
