import { BaseEntity } from '../_base/_base.entity'
import { Column, Entity } from 'typeorm'

@Entity('campaign_products')
export class CampaignProducts extends BaseEntity {
  @Column({ name: 'campaign_id', type: 'uuid' })
  campaignId: string

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string
}
