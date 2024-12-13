import { BaseEntity } from '../_base/_base.entity'
import { Column, Entity, OneToOne } from 'typeorm'

@Entity('prices')
export class Price extends BaseEntity {
  @Column()
  public monthly: number

  @Column()
  public annually: number

  @Column({ type: 'varchar', length: 3 })
  public currency: string
}
