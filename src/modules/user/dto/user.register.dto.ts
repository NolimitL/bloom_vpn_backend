import { IsString, IsNotEmpty } from 'class-validator'
import { LoginDto } from '../../auth/dto/login.dto'

export class UserRegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string
}
