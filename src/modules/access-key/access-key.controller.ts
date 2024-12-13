// import { Throttle } from '@nestjs/throttler'
// import { ThrottlerGuard } from '../../common/guards/throttle.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AccessKeyService } from './access-key.service'
import { TokenGuard } from '../../common/guards/token.guard'
import { UserId } from '../../common/decorators/user-id.decorator'
import { AccessKey } from '../../store/access-key/access-key.entity'
import { UpdateAccessKeyDataDto } from './dto/update.access-key.data.dto'
import { IAccessKeyData } from './interfaces/access-key-data.interface'

@UseGuards(TokenGuard)
@Controller('/access-keys')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @Get()
  async getUserAccessKeys(@UserId() userId: string): Promise<Array<AccessKey>> {
    return this.accessKeyService.retrieveAccessKeysForUser(userId)
  }

  @Post('/subscription/:subscriptionId')
  async createUserAccessKey(
    @UserId() userId: string,
    @Param('subscriptionId') subscriptionId: string
  ): Promise<AccessKey> {
    return this.accessKeyService.createAccessKeyForUser(userId, subscriptionId)
  }

  // TODO finish update flow
  @Put('/:id')
  async updateUserAccessKey(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: UpdateAccessKeyDataDto
  ): Promise<AccessKey> {
    return this.accessKeyService.updateAccessKeyForUser(userId, id, body)
  }

  @Delete('/:id')
  async deleteUserAccessKey(
    @UserId() userId: string,
    @Param('id') id: string
  ): Promise<void> {
    return this.accessKeyService.deleteAccessKey(userId, id)
  }

  @Get('/:id/data')
  async getUserAccessKeyData(@Param('id') id: string): Promise<IAccessKeyData> {
    return this.accessKeyService.getAccessKeyData(id)
  }
}
