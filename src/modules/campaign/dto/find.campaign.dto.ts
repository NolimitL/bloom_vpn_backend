import { CountryCode } from '../../../common/enums/countries.code.enum'
import { IsEnum, IsOptional, IsNumber } from 'class-validator'

export class FindCampaignDto {
  constructor(params: { localization?: CountryCode; period?: number }) {
    Object.entries(params).forEach(([key, v]) => {
      if (v) {
        this[key] = v
      }
    })
  }

  @IsOptional()
  @IsEnum(CountryCode)
  readonly localization: CountryCode

  @IsOptional()
  @IsNumber()
  readonly period: number
}
