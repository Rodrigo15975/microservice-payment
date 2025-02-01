import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OrdersModule } from './orders/orders.module'
import { PaymentModule } from './payment/payment.module'
// import { ProductsModule } from './products/products.module'
import { WebhooksModule } from './webhooks/webhooks.module'
@Module({
  imports: [
    // ProductsModule,
    PaymentModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production.local'
          : '.env.local',
      isGlobal: true,
    }),
    WebhooksModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
