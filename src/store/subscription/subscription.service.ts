import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subscription } from './subscription.entity'

@Injectable()
export class SubscriptionServiceStore {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>
  ) {}

  async findById(id: string): Promise<Subscription> {
    return this.subscriptionRepository.findOneOrFail({
      where: {
        id,
      },
    })
  }

  async findByUserId(userId: string): Promise<Array<Subscription>> {
    return this.subscriptionRepository.find({
      where: {
        userId,
      },
    })
  }

  async hasUserProduct(userId: string, productId: string): Promise<boolean> {
    return !!(await this.subscriptionRepository.findOne({
      where: {
        userId,
        productId,
      },
    }))
  }

  async save(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.save(subscription)
  }
}
