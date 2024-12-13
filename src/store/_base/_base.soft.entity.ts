import { BaseEntity } from './_base.entity'
import { UpdateDateColumn, DeleteDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

/**
 * Entity for soft deleting.
 * Expanded standard base entity with soft deleted field.
 * Expanded fields are:
 *  - deleted_at: Date
 * @global
 */
export class BaseSoftEntity extends BaseEntity {
  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deleted_at: Date
}
