import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Intention } from './intention.entity'

@Injectable()
export class IntentionServiceStore {
  constructor(
    @InjectRepository(Intention)
    private readonly intentionRepository: Repository<Intention>
  ) {}

  async findByEmail(email: string): Promise<Intention> {
    return this.intentionRepository.findOne({
      where: {
        intentionEmail: email,
      },
    })
  }

  async save(intention: Intention): Promise<Intention> {
    return this.intentionRepository.save(intention)
  }
}
