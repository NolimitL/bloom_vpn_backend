import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { UserRegisterDto } from '../user/dto/user.register.dto'
import { LoginDto } from './dto/login.dto'
import { Response } from 'express'
import { HashService } from '../tools/hash.service'
import { TokenService } from '../tools/token-manager/token.service'
import { CookiesService } from '../tools/cookies-manager/cookies.service'
import { UserServiceStore } from '../../store/user/user.service'
import { UserService } from '../user/user.service'
import { EmailResetDto } from './dto/email.reset.dto'
import { MailSenderService } from '../tools/mail-manager/mail-sender.service'
import { TOKEN_RESET_PASSWORD_LIFETIME } from './auth.constants'
import { MailTemplatesId } from '../tools/mail-manager/mail-templates-id.enum'
import { UserAlreadyExistsException } from '../../common/exceptions/user-already-exists.exception'
import { PasswordResetDto } from './dto/password.reset.dto'
import { ConfirmationService } from '../confirmation/confirmation.service'
import { TokenDto } from '../../common/dtos/token.dto'
import { NotPossibleException } from '../../common/exceptions/not-possible.exception'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly cookiesService: CookiesService,
    private readonly userStore: UserServiceStore,
    private readonly userService: UserService,
    private readonly mailSenderService: MailSenderService,
    private readonly confirmationService: ConfirmationService
  ) {}

  async register(userRegisterData: UserRegisterDto): Promise<void> {
    let user = await this.userStore.findByEmail(userRegisterData.email)
    if (!user) {
      user = await this.userService.createUser(userRegisterData)
    } else {
      throw new UserAlreadyExistsException()
    }

    await this.confirmationService.sendEmailConfirmation(user.id, user.email)
  }

  async login(userLoginData: LoginDto, res: Response): Promise<TokenDto> {
    const { email, password } = userLoginData
    const user = await this.userStore.findByEmail(email)
    if (!user) {
      // Don't let users know if an user exists or not
      throw new UnauthorizedException('Email or password are invalid')
    }
    const isPasswordValid = await this.hashService.verifyHash(
      password,
      user.password
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password are invalid')
    }
    const token = this.tokenService.createToken(user.id)

    this.cookiesService.writeTokenInCookies(res, token)
    return {
      token,
    }
  }

  async sendResetEmail(dataToReset: EmailResetDto): Promise<void> {
    const { email } = dataToReset
    const user = await this.userStore.findByEmail(email)
    if (user) {
      const resetToken = this.tokenService.createToken(user.id, {
        lifetime: TOKEN_RESET_PASSWORD_LIFETIME,
      })

      const resetUrl = AuthService.generateResetLink(resetToken)

      await this.mailSenderService.sendToEmail(
        email,
        MailTemplatesId.RESET_PASSWORD,
        {
          reset_password_url: resetUrl,
        }
      )
    } else {
      throw new NotPossibleException()
    }
  }

  async resetPassword(resetData: PasswordResetDto): Promise<void> {
    const { token, password } = resetData
    if (token) {
      const isTokenValid = this.tokenService.verifyToken(token)
      if (isTokenValid) {
        const userId = this.tokenService.decodeToken(token)
        await this.userService.updateUserPassword(userId, password)
      } else {
        throw new ForbiddenException('Unable to reset password')
      }
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    return this.tokenService.verifyToken(token)
  }

  async logout(res: Response): Promise<void> {
    await this.cookiesService.removeTokenInCookies(res)
  }

  private static generateResetLink(token: string): string {
    return `${process.env.FRONTEND_BASE_URL}reset/password?token=${token}`
  }
}
