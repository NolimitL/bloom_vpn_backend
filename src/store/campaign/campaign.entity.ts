import { BaseEntity } from '../_base/_base.entity'
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { ICampaignParameters } from './interface/campaign.parameters.interface'
import { Product } from '../product/product.entity'

@Entity('campaigns')
export class Campaign extends BaseEntity {
  @Column()
  public name: string

  @Column({
    name: 'parameters',
    type: 'jsonb',
    nullable: false,
    default: "'{}::jsonb'",
  })
  public parameters: ICampaignParameters

  @ManyToMany(() => Product, (product) => product.campaign, {
    eager: true,
  })
  @JoinTable({
    name: 'campaign_products',
    joinColumn: {
      name: 'campaign_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  public products: Array<Product>
}
