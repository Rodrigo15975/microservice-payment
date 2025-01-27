import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigService } from '@nestjs/config'
import { configExchange, configQueue } from 'src/payment/common/config-rabbit'

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('RABBITMQ_URL'),
        exchanges: configExchange,
        queues: configQueue,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
