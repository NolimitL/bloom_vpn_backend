import { Module } from '@nestjs/common'
import { StoreModule } from '../../store/store.module'
import { AccessVpnManagerService } from './access-vpn-manager/access-vpn-manager.service'
import { IManagerAccessConfig } from './access-vpn-manager/interface/manager-access.config.interface'
import { MailSenderService } from './mail-manager/mail-sender.service'
import { IMailSenderConfig } from './mail-manager/interface/mail-sender.config.interface'
import { HashService } from './hash.service'
import { TokenService } from './token-manager/token.service'
import { CookiesService } from './cookies-manager/cookies.service'
import { JwtModule } from '@nestjs/jwt'
import {
  TOKEN_AUTH_COOKIE_LIFETIME,
  TOKEN_AUTH_COOKIE_NAME,
} from './token-manager/token.constants'
import { JwtStrategy } from './strategies/jwt.strategy'
import { CodeService } from './code.service'

@Module({
  imports: [
    StoreModule,
    JwtModule.registerAsync({
      useFactory() {
        const jwtSecret = process.env.BLOOM_JWT_SECRET
        if (!jwtSecret) {
          throw new Error('JWT secret is not specified.')
        }

        return {
          secret: process.env.BLOOM_JWT_SECRET,
          signOptions: {
            algorithm: 'HS512',
          },
        }
      },
    }),
  ],
  providers: [
    // Strategy JWT
    {
      provide: JwtStrategy,
      useFactory(): JwtStrategy {
        return new JwtStrategy(process.env.BLOOM_JWT_SECRET)
      },
    },
    HashService,
    TokenService,
    CodeService,
    // Access Manager Service
    {
      provide: AccessVpnManagerService,
      useFactory(): AccessVpnManagerService {
        if (
          !process.env.MANAGER_API_HOST ||
          !process.env.MANAGER_API_PORT ||
          !process.env.MANAGER_API_KEY
        ) {
          throw new Error('Manager API credentials are not defined.')
        }
        if (!process.env.INVITATION_SERVER_URL) {
          throw new Error('Invitation Server URL is not defined.')
        }

        const credentials: IManagerAccessConfig = {
          host: process.env.MANAGER_API_HOST,
          port: process.env.MANAGER_API_PORT,
          key: process.env.MANAGER_API_KEY,
        }
        return new AccessVpnManagerService(credentials)
      },
    },
    // Mail Manager Service
    {
      provide: MailSenderService,
      useFactory(): MailSenderService {
        if (
          !process.env.SB_API_KEY ||
          !process.env.SB_MAIN_EMAIL ||
          !process.env.SB_SENDER_NAME
        ) {
          throw new Error(`Mail Sender credentials are not defined.`)
        }

        const credentials: IMailSenderConfig = {
          apiKey: process.env.SB_API_KEY,
          fromEmail: process.env.SB_MAIN_EMAIL,
          sender: process.env.SB_SENDER_NAME,
        }
        return new MailSenderService(credentials)
      },
    },
    // Cookies Manager Service
    {
      provide: CookiesService,
      useFactory(): CookiesService {
        return new CookiesService({
          cookieName: TOKEN_AUTH_COOKIE_NAME,
          cookieLifetime: TOKEN_AUTH_COOKIE_LIFETIME * 1000,
          allowSameSiteNone: !!process.env.ALLOW_NO_SAME_SITE,
        })
      },
    },
  ],
  exports: [
    JwtStrategy,
    AccessVpnManagerService,
    MailSenderService,
    CookiesService,
    HashService,
    TokenService,
    CodeService,
  ],
})
export class ToolsModule {}
