import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { StoreModule } from '../../store/store.module'

@Module({
  imports: [StoreModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
