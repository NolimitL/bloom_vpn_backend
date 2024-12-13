import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class UserUpdateDto {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsISO8601()
  @IsOptional()
  birthdate?: string

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string
}
