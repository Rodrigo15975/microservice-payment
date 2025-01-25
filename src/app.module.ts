import { Module } from '@nestjs/common'
import { PaymentModule } from './payment/payment.module'
import { ConfigModule } from '@nestjs/config'
@Module({
  imports: [
    PaymentModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production.local'
          : '.env.local',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
