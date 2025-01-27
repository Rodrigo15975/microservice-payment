import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'

export const configRabbit = {
  ROUTING_EXCHANGE_DECREMENT_STOCK_PRODUCT: 'product.decrement.stock.product',
  ROUTING_ROUTINGKEY_DECREMENT_STOCK_PRODUCT: 'product.decrement.stock.product',
  ROUTING_QUEUE_DECREMENT_STOCK_PRODUCT: 'product.decrement.stock.product',
}
export const configQueue: RabbitMQQueueConfig[] = [
  {
    name: configRabbit.ROUTING_QUEUE_DECREMENT_STOCK_PRODUCT,
    routingKey: configRabbit.ROUTING_QUEUE_DECREMENT_STOCK_PRODUCT,
    exchange: configRabbit.ROUTING_QUEUE_DECREMENT_STOCK_PRODUCT,
    options: {
      durable: true,
    },
  },
]
export const configExchange: RabbitMQExchangeConfig[] = [
  {
    name: configRabbit.ROUTING_EXCHANGE_DECREMENT_STOCK_PRODUCT,
    type: 'direct',
    options: {
      durable: true,
    },
  },
]
