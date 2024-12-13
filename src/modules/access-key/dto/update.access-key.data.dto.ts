import { IsOptional, IsString } from 'class-validator'

export class UpdateAccessKeyDataDto {
  @IsString()
  @IsOptional()
  keyName?: string
}
