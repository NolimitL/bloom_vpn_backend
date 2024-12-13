import { CountryCode } from '../../../common/enums/countries.code.enum'

export interface ICampaignParameters {
  period?: number
  localization?: CountryCode
}
