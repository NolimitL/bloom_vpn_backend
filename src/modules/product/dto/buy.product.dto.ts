import { IsNotEmpty, IsString } from 'class-validator'

export class BuyProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string
}
