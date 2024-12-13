import { Injectable } from '@nestjs/common'
import { ProductServiceStore } from '../../store/product/product.service'
import { Product } from '../../store/product/product.entity'

@Injectable()
export class ProductService {
  constructor(private readonly productStore: ProductServiceStore) {}

  async retrieveAllProduct(): Promise<Array<Product>> {
    const products = await this.productStore.getProducts()
    return this.sortProducts(products)
  }

  /**
   * Main product do have MAIN campaign
   */
  async revealMainProducts(): Promise<Array<Product>> {
    const products = await this.productStore.findMainProducts()
    return this.sortProducts(products)
  }

  /**
   *
   * @param products
   */
  public sortProducts(products: Array<Product>): Array<Product> {
    const arr = [...products]
    return arr.sort((a, b) =>
      a.metadata && a.metadata.position && b.metadata && b.metadata.position
        ? a.metadata.position - b.metadata.position
        : 0
    )
  }
}
