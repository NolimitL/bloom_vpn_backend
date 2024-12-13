import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude, plainToInstance } from 'class-transformer'
import { v4 as uuidv4 } from 'uuid'
import { CreateIntentionDto } from './create.intention.dto'
import { BaseEntity } from '../_base/_base.entity'

@Entity('intentions')
export class Intention extends BaseEntity {
  static fromDto(createIntentionDto: CreateIntentionDto): Intention {
    const intention = plainToInstance(Intention, createIntentionDto)
    intention.id = uuidv4()
    intention.intentionEmail = createIntentionDto.email
    intention.reminderSend = 0

    return intention
  }

  @Column({ name: 'intention_email' })
  intentionEmail: string

  @Column({ name: 'reminder_send' })
  reminderSend: number
}
