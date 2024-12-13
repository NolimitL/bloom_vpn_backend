import { Injectable, NotFoundException } from '@nestjs/common'
import { SubscriptionServiceStore } from '../../store/subscription/subscription.service'
import { Subscription } from '../../store/subscription/subscription.entity'
import { ProductServiceStore } from '../../store/product/product.service'
import { CodeService } from '../tools/code.service'
import { TRIAL_SUBSCRIPTION_TIME } from '../../common/constants'
import { NotPossibleException } from '../../common/exceptions/not-possible.exception'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionStore: SubscriptionServiceStore,
    private readonly productStore: ProductServiceStore,
    private readonly codeService: CodeService
  ) {}

  async getUserSubscriptions(userId: string): Promise<Array<Subscription>> {
    return this.subscriptionStore.findByUserId(userId)
  }

  async purchaseTrialProduct(userId: string): Promise<void> {
    const products = await this.productStore.getProducts()
    const trialId = products.find(
      (product) => product.name.toLowerCase() == 'trial'
    ).id
    if (!trialId) {
      throw new NotFoundException(
        'Trial product is not found. Please contact support.'
      )
    }
    const isExist = await this.subscriptionStore.hasUserProduct(userId, trialId)
    if (isExist) {
      throw new NotPossibleException('You already has trial subscription.')
    }
    await this.createSubscription(userId, trialId)
  }

  async createSubscription(userId: string, productId: string): Promise<void> {
    const trialSubscription = Subscription.fromUserId(userId, productId)

    trialSubscription.code = this.codeService.generateCode()
    trialSubscription.endDate = new Date(
      new Date().getTime() + TRIAL_SUBSCRIPTION_TIME
    )

    await this.subscriptionStore.save(trialSubscription)
  }
}
