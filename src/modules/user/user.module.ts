import { Module } from '@nestjs/common'
import { StoreModule } from '../../store/store.module'
import { UserService } from './user.service'
import { ToolsModule } from '../tools/tools.module'
import { UserController } from './user.controller'
import { ConfirmationModule } from '../confirmation/confirmation.module'
import { UserLocalizationService } from './user.localization.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [StoreModule, ToolsModule, ConfirmationModule, HttpModule],
  controllers: [UserController],
  providers: [UserService, UserLocalizationService],
  exports: [UserService, UserLocalizationService],
})
export class UserModule {}
