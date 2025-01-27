import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class OrdersService {
  private readonly logger: Logger = new Logger(OrdersService.name)
  constructor(private readonly amqConnection: AmqpConnection) {}

  create(metadata: Stripe.Metadata) {
    try {
      console.log({
        metadata,
      })
    } catch (error) {
      this.logger.error('Error in method create order')
      throw new InternalServerErrorException({
        message: error.message,
        error,
      })
    }
  }
}
