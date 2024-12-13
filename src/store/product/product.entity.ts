import { BaseEntity } from '../_base/_base.entity'
import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm'
import { Price } from '../price/price.entity'
import { IProductMetadata } from './interface/product.metadata.interface'
import { Campaign } from '../campaign/campaign.entity'

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  public name: string

  @Column()
  public description: string

  /**
   * Amount of devices allowed to connect
   */
  @Column()
  public devices: number

  /**
   * Amount of traffic in GB
   */
  @Column()
  public traffic: number

  @Column({ name: 'metadata', type: 'json', nullable: true, default: null })
  public metadata: IProductMetadata

  @OneToOne(() => Price, (price) => price.id, {
    cascade: ['remove'],
    eager: true,
  })
  @JoinColumn({ name: 'id' })
  public price: Price

  @ManyToMany(() => Campaign, (campaign) => campaign.products)
  public campaign: Array<Campaign>
}
