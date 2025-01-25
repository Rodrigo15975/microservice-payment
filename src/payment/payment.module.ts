import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { StripeModule } from '@golevelup/nestjs-stripe'
@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: 'sk_***',
      webhookConfig: {
        stripeSecrets: {
          account: 'whsec_***',
          accountTest: 'whsec_***',
          connect: 'whsec_***',
          connectTest: 'whsec_***',
        },
      },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
