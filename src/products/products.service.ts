import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  constructor(private readonly amqConnection: AmqpConnection) {}
  public async decrementStock(metadata: Stripe.Metadata) {
    try {
      console.log({
        metadata,
      })
    } catch (error) {
      this.logger.error('Error send decremente stock in product DB-WRITE-READ')
      throw new InternalServerErrorException({
        message: error.message,
        error,
      })
    }
  }
}
