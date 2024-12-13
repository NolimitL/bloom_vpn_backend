import { IsNotEmpty, IsString } from 'class-validator'

export class EmailResetDto {
  @IsString()
  @IsNotEmpty()
  email: string
}
