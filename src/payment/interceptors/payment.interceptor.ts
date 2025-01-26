import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
// import { Observable } from 'rxjs'
import { STRIPE_WEBHOOK_CONTEXT_TYPE } from '@golevelup/nestjs-stripe'

@Injectable()
export class StripeWebhookInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const contextType = context.getType<
      'http' | typeof STRIPE_WEBHOOK_CONTEXT_TYPE
    >()
    Logger.debug('contextType', contextType)
    // Do nothing if this is a Stripe webhook event
    if (contextType === STRIPE_WEBHOOK_CONTEXT_TYPE) {
      return next.handle()
    }

    // Execute custom interceptor logic for HTTP request/response
    return next.handle()
  }
}
