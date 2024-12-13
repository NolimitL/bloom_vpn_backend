import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccessKey } from './access-key.entity'

@Injectable()
export class AccessKeyServiceStore {
  constructor(
    @InjectRepository(AccessKey)
    private readonly accessKeyRepository: Repository<AccessKey>
  ) {}

  async findById(id: string): Promise<AccessKey> {
    return this.accessKeyRepository.findOne({
      where: {
        id,
      },
      withDeleted: false,
    })
  }

  async findByUserId(userId: string): Promise<Array<AccessKey>> {
    return this.accessKeyRepository.find({
      where: {
        subscription: {
          userId,
        },
      },
      withDeleted: false,
    })
  }

  async findBySubscriptionId(
    subscriptionId: string
  ): Promise<Array<AccessKey>> {
    return this.accessKeyRepository.find({
      where: {
        subscriptionId,
      },
      withDeleted: false,
    })
  }

  async deleteSoft(id: string): Promise<void> {
    await this.accessKeyRepository.softDelete({
      id: id,
    })
  }

  async save(accessKey: AccessKey): Promise<AccessKey> {
    return this.accessKeyRepository.save(accessKey)
  }
}
