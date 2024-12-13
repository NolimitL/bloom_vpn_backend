import { IsNotEmpty, IsString } from 'class-validator'

export class UserUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  newPassword: string
}
