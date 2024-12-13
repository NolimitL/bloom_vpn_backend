import { Injectable, Logger } from '@nestjs/common'
import { ILocalization } from './interface/localization.interface'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { AxiosError } from 'axios'
import { getClientIp } from 'request-ip'
import { Request } from 'express'

@Injectable()
export class UserLocalizationService {
  private readonly logger = new Logger(UserLocalizationService.name)
  private readonly geoIPId: string
  private readonly geoIPKey: string

  constructor(private readonly httpClient: HttpService) {
    if (!process.env.GEOIP_ID || !process.env.GEOIP_KEY) {
      throw new Error(
        'Localization is not possible. Credentials for Geo_IP is not defined.'
      )
    }
    this.geoIPId = process.env.GEOIP_ID
    this.geoIPKey = process.env.GEOIP_KEY
  }

  async getLocalizationData(req: Request): Promise<ILocalization> {
    const ip = getClientIp(req)
    if (!ip) {
      return null
    }
    const base64encodedData = Buffer.from(
      this.geoIPId + ':' + this.geoIPKey
    ).toString('base64')
    try {
      const { data } = await lastValueFrom(
        this.httpClient.get(
          // 'https://geolite.info/geoip/v2.1/country/5.106.113.98', // IR Test ip
          `https://geolite.info/geoip/v2.1/country/${ip}`,
          {
            headers: {
              Authorization: `Basic ${base64encodedData}`,
            },
          }
        )
      )
      if (!data) {
        throw new Error('Localization data is empty.')
      }
      return {
        ip,
        country: data.country.iso_code,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.warn(`Unable to receive IP Data: ${error.response.data}`)
      }
      return {
        ip,
        country: null,
      }
    }
  }
}
