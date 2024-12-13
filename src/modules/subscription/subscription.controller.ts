import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { Subscription } from '../../store/subscription/subscription.entity'
import { UserId } from '../../common/decorators/user-id.decorator'
import { TokenGuard } from '../../common/guards/token.guard'

@UseGuards(TokenGuard)
@Controller('/subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getUserSubscriptions(
    @UserId() userId: string
  ): Promise<Array<Subscription>> {
    return this.subscriptionService.getUserSubscriptions(userId)
  }

  @Post('/trial')
  async getTrialProduct(@UserId() userId: string): Promise<void> {
    return this.subscriptionService.purchaseTrialProduct(userId)
  }
}
