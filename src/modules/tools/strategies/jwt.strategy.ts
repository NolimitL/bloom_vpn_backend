import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from './jwt.payload'
import { TOKEN_AUTH_COOKIE_NAME } from '../token-manager/token.constants'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(secret: string) {
    super({
      jwtFromRequest: extractJwtFromRequest,
      ignoreExpiration: true,
      secretOrKey: secret,
    })
  }

  validate(payload: JwtPayload | any): { userId: string } {
    return { userId: payload.user_id }
  }
}

const extractJwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  (req: Request): string | null => {
    if (req && req.cookies) {
      return req.cookies[TOKEN_AUTH_COOKIE_NAME]
    }

    return null
  },
])
