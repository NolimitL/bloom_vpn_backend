import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { ForbiddenToPerformException } from '../exceptions/forbidden-to-perform.exception'
import { SubscriptionServiceStore } from '../../store/subscription/subscription.service'

@Injectable()
export class SubscriptionOwnerGuard implements CanActivate {
  private readonly logger = new Logger(SubscriptionOwnerGuard.name)

  constructor(private readonly subscriptionStore: SubscriptionServiceStore) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      headers,
      url,
      params: { subscriptionId },
    } = context.switchToHttp().getRequest()
    if (!user) {
      this.logger.warn(
        `Request [origin:${headers.origin}] tries to perform the action: "${url}".`
      )
    } else {
      try {
        const subscription = await this.subscriptionStore.findById(
          subscriptionId
        )
        if (subscription.userId === user.userId) {
          return true
        }
      } catch (e) {
        this.logger.warn(
          `Unable to find relevant subscription: ${subscriptionId}`
        )
      }
    }
    throw new ForbiddenToPerformException()
  }
}
