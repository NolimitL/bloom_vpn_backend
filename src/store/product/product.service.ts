import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './product.entity'

@Injectable()
export class ProductServiceStore {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async getProducts(): Promise<Array<Product>> {
    return this.productRepository.find()
  }

  async findMainProducts(): Promise<Array<Product>> {
    return this.productRepository.find({
      where: {
        campaign: {
          name: 'Main',
        },
      },
    })
  }
}
