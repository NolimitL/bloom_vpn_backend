import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { IntentionServiceStore } from '../../store/intention/intention.service'
import { CreateIntentionDto } from '../../store/intention/create.intention.dto'
import { Intention } from '../../store/intention/intention.entity'
import { MailSenderService } from '../tools/mail-manager/mail-sender.service'
import { MailTemplatesId } from '../tools/mail-manager/mail-templates-id.enum'
import { AccessVpnManagerService } from '../tools/access-vpn-manager/access-vpn-manager.service'
import { AccessKey } from '../../store/access-key/access-key.entity'
import { AccessKeyServiceStore } from '../../store/access-key/access-key.service'
import { Subscription } from '../../store/subscription/subscription.entity'
import { SubscriptionServiceStore } from '../../store/subscription/subscription.service'
import { EntityNotFoundError } from 'typeorm'
import { UserServiceStore } from '../../store/user/user.service'
import { AccessKeyDataDto } from './dto/access-key.data.dto'
import { UpdateAccessKeyDataDto } from './dto/update.access-key.data.dto'
import { ForbiddenToPerformException } from '../../common/exceptions/forbidden-to-perform.exception'
import { IAccessKeyData } from './interfaces/access-key-data.interface'

@Injectable()
export class AccessKeyService {
  private readonly logger = new Logger(AccessKeyService.name)

  constructor(
    private readonly intentionStore: IntentionServiceStore,
    private readonly mailSenderService: MailSenderService,
    private readonly accessManagerService: AccessVpnManagerService,
    private readonly accessKeyStore: AccessKeyServiceStore,
    private readonly subscriptionStore: SubscriptionServiceStore,
    private readonly userStore: UserServiceStore
  ) {}

  async retrieveAccessKeysForUser(userId: string): Promise<Array<AccessKey>> {
    return this.accessKeyStore.findByUserId(userId)
  }

  async createAccessKeyForUser(
    userId: string,
    subscriptionId: string
  ): Promise<AccessKey> {
    const currentKeys = await this.accessKeyStore.findBySubscriptionId(
      subscriptionId
    )

    let subscription: Subscription
    if (currentKeys.length === 0) {
      try {
        subscription = await this.subscriptionStore.findById(subscriptionId)
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(
            "We don't find your subscription. Please contact the customer support."
          )
        }
        throw error
      }
    } else if (
      currentKeys.length < currentKeys[0].subscription.product.devices
    ) {
      subscription = currentKeys[0].subscription
    } else {
      this.logger.log('Amount of possible keys is completely exhausted.')
      throw new BadRequestException({
        message:
          'Cannot create a new key for current subscription. Amount of keys for the subscription ran out.',
        keys: currentKeys,
      })
    }

    const { email: userEmail } = await this.userStore.findById(userId)

    try {
      const accessKeyUserData = await this.accessManagerService.createAccessKey(
        userEmail,
        subscription.code
      )

      const accessKeyDataDto: AccessKeyDataDto = {
        ...accessKeyUserData,
        dataLimit: {
          bytes: Number(process.env.MANAGER_API_DATA_LIMIT),
        },
      }

      const newAccessKeyData = AccessKey.fromAccessKeyDataDto(
        accessKeyDataDto,
        subscriptionId
      )
      this.logger.log(newAccessKeyData)

      return this.accessKeyStore.save(newAccessKeyData)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unable to create access key.')
    }
  }

  async updateAccessKeyForUser(
    userId: string,
    keyId: string,
    updateBody: UpdateAccessKeyDataDto
  ): Promise<AccessKey> {
    // TODO create a logic for update access key
    return null
  }

  async deleteAccessKey(userId: string, keyId: string): Promise<void> {
    let key: AccessKey
    try {
      key = await this.accessKeyStore.findById(keyId)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unable to delete access key.')
    }
    if (key.subscription.userId === userId) {
      await this.accessKeyStore.deleteSoft(key.id)
      await this.accessManagerService.deleteKey(key.keyId)
    } else {
      throw new ForbiddenToPerformException()
    }
  }

  async getAccessKeyData(keyId: string): Promise<IAccessKeyData> {
    try {
      const bytes = await this.accessManagerService.getKeyTransferredData(keyId)
      return {
        data: bytes,
      }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unable to delete access key.')
    }
  }
}
