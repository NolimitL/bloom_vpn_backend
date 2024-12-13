import {
  Body,
  Controller,
  Get,
  Logger,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import { TokenGuard } from '../../common/guards/token.guard'
import { User } from '../../store/user/user.entity'
import { UserId } from '../../common/decorators/user-id.decorator'
import { UserUpdateDto } from './dto/user.update.dto'
import { UserService } from './user.service'
import { UserUpdatePasswordDto } from './dto/user.update.password.dto'
import { ILocalization } from './interface/localization.interface'
import { UserLocalizationService } from './user.localization.service'
import { Request } from 'express'

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name)
  constructor(
    private readonly userService: UserService,
    private readonly userLocalizationService: UserLocalizationService
  ) {}

  @UseGuards(TokenGuard)
  @Get()
  async getUser(@UserId() userId: string): Promise<User> {
    return this.userService.getUserData(userId)
  }

  @UseGuards(TokenGuard)
  @Put()
  async updateUser(
    @Body() body: UserUpdateDto,
    @UserId() userId: string
  ): Promise<User> {
    return this.userService.updateUser(userId, body)
  }

  @UseGuards(TokenGuard)
  @Put('/password')
  async updatePassword(
    @Body() body: UserUpdatePasswordDto,
    @UserId() userId: string
  ): Promise<User> {
    return this.userService.updateUserPasswordByOldPassword(
      userId,
      body.password,
      body.newPassword
    )
  }

  /**
   * Localization endpoint to reveal IP data
   */
  @Get('/localization')
  async getLocalizationData(@Req() req: Request): Promise<ILocalization> {
    return this.userLocalizationService.getLocalizationData(req)
  }
}
