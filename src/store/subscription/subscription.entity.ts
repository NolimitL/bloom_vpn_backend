import { BaseEntity } from '../_base/_base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Product } from '../product/product.entity'
import { v4 as uuidv4 } from 'uuid'

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  static fromUserId(userId: string, productId: string): Subscription {
    const sub = new Subscription()
    sub.id = uuidv4()
    sub.userId = userId
    sub.productId = productId
    sub.startDate = new Date()

    return sub
  }

  @Column({ name: 'user_id' })
  public userId: string

  @Column({ name: 'product_id' })
  public productId: string

  @Column()
  public code: string

  @Column({ name: 'start_date' })
  public startDate: Date

  @Column({ name: 'end_date' })
  public endDate: Date

  @ManyToOne(() => Product, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product
}
