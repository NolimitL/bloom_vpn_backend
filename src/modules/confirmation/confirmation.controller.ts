import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ConfirmationService } from './confirmation.service'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { TokenDto } from '../../common/dtos/token.dto'

@Controller('/confirm')
export class ConfirmationController {
  constructor(private readonly confirmationService: ConfirmationService) {}

  @Throttle(5, 60)
  @UseGuards(ThrottlerGuard)
  @Post('/email')
  async confirmEmail(@Body() body: TokenDto): Promise<boolean> {
    return this.confirmationService.confirmEmail(body.token)
  }
}
