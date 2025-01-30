import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { configExchange, configQueue } from 'src/payment/common/config-rabbit'
import { ConfigService } from '@nestjs/config'

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
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
