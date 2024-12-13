import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ITokenOptions } from './interface/token-options.interface'
import { JWT_ISSUER } from './token.constants'
import { JwtPayload } from '../strategies/jwt.payload'

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name)
  private readonly defaultLifeTime = 86400 // 1d in seconds

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Common method to generate token with different options, e.g. lifetime value.
   *
   * @param userId
   * @param options
   */
  createToken(userId: string, options?: ITokenOptions): string {
    const nowTimestamp = Math.floor(Date.now() / 1000)

    const payload: JwtPayload | object = {
      iss: JWT_ISSUER,
      iat: nowTimestamp,
      aud: JWT_ISSUER + '_users',
      exp: nowTimestamp + (options ? options.lifetime : this.defaultLifeTime),
      user_id: userId,
    }
    return this.jwtService.sign(payload, {
      algorithm: 'HS512',
    })
  }

  /**
   * Common verification token method
   *
   * @param token Token to verify
   * @return boolean is valid true, in another case false
   * */
  verifyToken(token: string): boolean {
    try {
      this.jwtService.verify(token)
      return true
    } catch {}

    return false
  }

  decodeToken(token: string): string {
    try {
      const { user_id } = this.jwtService.decode(token) as JwtPayload
      if (user_id) {
        return user_id
      } else {
        throw new Error('Decoded data is undefined.')
      }
    } catch (error) {
      this.logger.error(`Error during decode token process: ${error}`)
    }
  }
}
