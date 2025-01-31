import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import Stripe from 'stripe'
import { configRabbit } from './common/configRabbit'

@Injectable()
export class OrdersService {
  private readonly logger: Logger = new Logger(OrdersService.name)
  constructor(private readonly amqConnection: AmqpConnection) {}

  create(metadata: Stripe.Metadata) {
    try {
      this.amqConnection.publish(
        configRabbit.ROUTING_EXCHANGE_CREATE_ORDERS,
        configRabbit.ROUTING_ROUTINGKEY_CREATE_ORDERS,
        metadata,
      )
      this.logger.verbose('Send order to create in DB-CLIENT-ORDER...')
    } catch (error) {
      this.logger.error('Error in method create order (db-clients)')
      throw new InternalServerErrorException({
        message: error.message,
        error,
      })
    }
  }
}
