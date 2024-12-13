import { InjectRepository } from '@nestjs/typeorm'
import { Price } from './price.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PriceServiceStore {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>
  ) {}
}
