import { Controller, Get } from '@nestjs/common'
import { Product } from '../../store/product/product.entity'
import { ProductService } from './product.service'

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // TODO setup privileges to reveal all products
  // @UseGuards(TokenGuard)
  // @Get()
  // async getAllProducts(): Promise<Array<Product>> {
  //   return this.productService.retrieveAllProduct()
  // }

  @Get('/main')
  async getMainProducts(): Promise<Array<Product>> {
    return this.productService.revealMainProducts()
  }
}
