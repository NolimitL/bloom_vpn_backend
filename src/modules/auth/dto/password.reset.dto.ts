import { IsNotEmpty, IsString } from 'class-validator'
import { TokenDto } from '../../../common/dtos/token.dto'

export class PasswordResetDto extends TokenDto {
  @IsString()
  @IsNotEmpty()
  password: string
}
