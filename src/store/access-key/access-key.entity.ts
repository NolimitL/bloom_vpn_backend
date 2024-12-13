import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Exclude } from 'class-transformer'
import { AccessKeyStatus } from './enum/access-key.status.enum'
import { BaseSoftEntity } from '../_base/_base.soft.entity'
import { Subscription } from '../subscription/subscription.entity'
import { AccessKeyDataDto } from '../../modules/access-key/dto/access-key.data.dto'
import { v4 as uuidv4 } from 'uuid'

@Entity('access_keys')
export class AccessKey extends BaseSoftEntity {
  static fromAccessKeyDataDto(
    accessKeyDataDto: AccessKeyDataDto,
    subscriptionId: string
  ): AccessKey {
    const accessKey = new AccessKey()
    accessKey.id = uuidv4()
    accessKey.subscriptionId = subscriptionId
    accessKey.port = `${accessKeyDataDto.port}`
    accessKey.method = accessKeyDataDto.method
    accessKey.accessKey = accessKeyDataDto.accessUrl
    accessKey.keyId = accessKeyDataDto.id
    accessKey.keyName = accessKeyDataDto.name
    accessKey.password = accessKeyDataDto.password
    accessKey.dataLimit = accessKeyDataDto.dataLimit.bytes
    accessKey.status = AccessKeyStatus.ACTIVE
    // TODO receive information about device

    return accessKey
  }

  @Column({ name: 'subscription_id' })
  public subscriptionId: string

  /**
   * Connection port
   */
  @Exclude({ toPlainOnly: true })
  @Column()
  port: string

  /**
   * Encryption method
   */
  @Exclude({ toPlainOnly: true })
  @Column()
  method: string

  /**
   * Amount of bytes
   */
  @Column({ name: 'data_limit', type: 'bigint' })
  dataLimit: number

  @Column()
  status: AccessKeyStatus

  /**
   * Outline default configuration
   */
  @Exclude({ toPlainOnly: true })
  @Column({ name: 'key_id' })
  keyId: string

  @Column({ name: 'key_name' })
  keyName: string

  @Column({ name: 'access_key' })
  accessKey: string

  @Column()
  @Exclude({ toPlainOnly: true })
  device: string

  @Column()
  @Exclude()
  password: string

  @ManyToOne(() => Subscription, {
    eager: true,
  })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription
}
