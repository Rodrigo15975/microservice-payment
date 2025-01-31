import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'

export const configRabbit = {
  ROUTING_EXCHANGE_CREATE_PAYMENT: 'payment.create.payment',
  ROUTING_ROUTINGKEY_CREATE_PAYMENT: 'payment.create.payment',
  ROUTING_QUEUE_CREATE_PAYMENT: 'payment.create.payment',

  ROUTING_EXCHANGE_GET_ALL_ORDERS: 'client.get.all.order',
  ROUTING_ROUTINGKEY_GET_ALL_ORDERS: 'client.get.all.order',
  ROUTING_QUEUE_GET_ALL_ORDERS: 'client.get.all.order',
}
export const configQueue: RabbitMQQueueConfig[] = [
  {
    name: configRabbit.ROUTING_QUEUE_CREATE_PAYMENT,
    routingKey: configRabbit.ROUTING_ROUTINGKEY_CREATE_PAYMENT,
    exchange: configRabbit.ROUTING_EXCHANGE_CREATE_PAYMENT,
    options: {
      durable: true,
    },
  },
  {
    name: configRabbit.ROUTING_QUEUE_GET_ALL_ORDERS,
    routingKey: configRabbit.ROUTING_ROUTINGKEY_GET_ALL_ORDERS,
    exchange: configRabbit.ROUTING_EXCHANGE_GET_ALL_ORDERS,
    options: {
      durable: true,
      // expires: 60000,
      // messageTtl: 30000, // Los mensajes expiran si no son consumidos en el tiempo definido.
      // autoDelete: true, //Borra la cola cuando ya no hay consumidores activos.
    },
  },
]
export const configExchange: RabbitMQExchangeConfig[] = [
  {
    name: configRabbit.ROUTING_EXCHANGE_CREATE_PAYMENT,
    type: 'direct',
    options: {
      durable: true,
    },
  },
  {
    name: configRabbit.ROUTING_EXCHANGE_GET_ALL_ORDERS,
    type: 'direct',
    options: {
      durable: true,
      // expires: 60000,
      // messageTtl: 30000, // Los mensajes expiran si no son consumidos en el tiempo definido.
      // autoDelete: true, //Borra la cola cuando ya no hay consumidores activos.
    },
  },
]
