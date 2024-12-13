import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateIntentionDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string
}
