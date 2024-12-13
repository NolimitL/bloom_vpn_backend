import { CookieOptions, Response } from 'express'
import { Injectable } from '@nestjs/common'
import { ICookiesOptions } from './interface/cookies-options.interface'

@Injectable()
export class CookiesService {
  private readonly cookieName: string
  private readonly cookieLifetime: number
  private readonly allowSameSiteNone: boolean

  constructor(options: ICookiesOptions) {
    const { cookieName, cookieLifetime, allowSameSiteNone } = options

    this.cookieName = cookieName
    this.cookieLifetime = cookieLifetime
    this.allowSameSiteNone = allowSameSiteNone
  }

  writeTokenInCookies(res: Response, token: string): void {
    const baseOptions = this.getBaseCookieOptions()

    res.cookie(this.cookieName, token, {
      ...baseOptions,
      maxAge: this.cookieLifetime,
    })
  }

  removeTokenInCookies(res: Response): void {
    const baseOptions = this.getBaseCookieOptions()

    res.cookie(this.cookieName, '', {
      ...baseOptions,
      maxAge: -1,
    })
  }

  private getBaseCookieOptions(): CookieOptions {
    return {
      secure: this.allowSameSiteNone,
      sameSite: this.allowSameSiteNone ? 'none' : 'lax',
      httpOnly: true,
    }
  }
}
