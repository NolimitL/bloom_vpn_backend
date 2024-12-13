import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

/**
 * Standard base properties for every entity.
 * Default fields are:
 *  - id: uuid
 *  - created_at: Date
 *  - updated_at: Date
 * @global
 */
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created_at: Date

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updated_at: Date
}
