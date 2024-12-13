import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserRegisterDto } from '../user/dto/user.register.dto'
import { LoginDto } from './dto/login.dto'
import { Request, Response } from 'express'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { EmailResetDto } from './dto/email.reset.dto'
import { PasswordResetDto } from './dto/password.reset.dto'
import { TokenDto } from '../../common/dtos/token.dto'
import { TokenGuard } from '../../common/guards/token.guard'
import { UserId } from '../../common/decorators/user-id.decorator'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(1, 1)
  @UseGuards(ThrottlerGuard)
  @Post('/signup')
  async signup(
    @Body() body: UserRegisterDto,
    @Req() req: Request
  ): Promise<void> {
    const origin = req.header('Origin')
    if (!origin) {
      throw new ForbiddenException()
    }
    await this.authService.register(body)
    return
  }

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<TokenDto> {
    const origin = req.header('Origin')
    if (!origin) {
      throw new ForbiddenException()
    }
    return await this.authService.login(body, res)
  }

  @Throttle(5, 60)
  @UseGuards(ThrottlerGuard)
  @Post('/reset/link')
  async sendResetEmail(
    @Body() body: EmailResetDto,
    @Req() req: Request
  ): Promise<void> {
    const origin = req.header('Origin')
    if (!origin) {
      throw new ForbiddenException()
    }
    await this.authService.sendResetEmail(body)
    return
  }

  @Post('/reset/token/verify')
  async verifyResetToken(@Body() body: TokenDto): Promise<boolean> {
    const { token } = body
    return this.authService.verifyToken(token)
  }

  @Post('/reset/password')
  async resetPassword(@Body() body: PasswordResetDto): Promise<void> {
    await this.authService.resetPassword(body)
    return
  }

  @Post('/logout')
  async logoutUser(@Res({ passthrough: true }) res: Response): Promise<void> {
    await this.authService.logout(res)
    return
  }
}
