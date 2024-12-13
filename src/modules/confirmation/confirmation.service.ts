import { TokenService } from '../tools/token-manager/token.service'
import * as ms from 'ms'
import { MailSenderService } from '../tools/mail-manager/mail-sender.service'
import { MailTemplatesId } from '../tools/mail-manager/mail-templates-id.enum'
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { UserService } from '../user/user.service'

const TOKEN_CONFIRMATION_LIFETIME = ms('1d') / 1000

@Injectable()
export class ConfirmationService {
  private readonly REDIRECT_URI =
    process.env.FRONTEND_BASE_URL + 'confirm/email'

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailSenderService: MailSenderService
  ) {}

  async sendEmailConfirmation(userId: string, email: string): Promise<void> {
    const token = this.tokenService.createToken(userId, {
      lifetime: TOKEN_CONFIRMATION_LIFETIME,
    })
    const confirmationUrl = this.generateConfirmationUrl(token)

    await this.mailSenderService.sendToEmail(
      email,
      MailTemplatesId.EMAIL_CONFIRMATION,
      {
        confirmation_url: confirmationUrl,
      }
    )
  }

  async confirmEmail(token: string): Promise<boolean> {
    const isTokenValid = this.tokenService.verifyToken(token)
    if (isTokenValid) {
      const userId = this.tokenService.decodeToken(token)

      const user = await this.userService.updateUserConfirmation(userId, true)
      await this.sendWelcomeEmail(user.email)
      return !!user
    } else {
      throw new ForbiddenException(
        'Unable to confirm email. Token is not valid.'
      )
    }
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    await this.mailSenderService.sendToEmail(
      email,
      MailTemplatesId.WELCOME_EMAIL,
      {}
    )
  }

  private generateConfirmationUrl(token: string, redirectUri?: string): string {
    // TODO create correct url to frontend part
    return `${redirectUri || this.REDIRECT_URI}?token=${token}`
  }
}
