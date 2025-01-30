import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import Stripe from 'stripe'
import { configRabbit } from './common/configRabbit'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  constructor(private readonly amqConnection: AmqpConnection) {}
  public decrementStock(metadata: Stripe.Metadata) {
    console.log({
      metadata,
    })

    try {
      this.amqConnection.publish(
        configRabbit.EXCHANGE_NAME_DECREMENTE_STOCK,
        configRabbit.ROUTING_KEY_DECREMENTE_STOCK,
        metadata,
      )
      this.logger.verbose('Send decremente stock in product DB-WRITE-READ...')
    } catch (error) {
      this.logger.error('Error send decremente stock in product DB-WRITE-READ')
      throw new InternalServerErrorException({
        message: error.message,
        error,
      })
    }
  }
}
