import { forwardRef, Module } from '@nestjs/common'
import { ConfirmationService } from './confirmation.service'
import { ConfirmationController } from './confirmation.controller'
import { ToolsModule } from '../tools/tools.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [ToolsModule, forwardRef(() => UserModule)],
  controllers: [ConfirmationController],
  providers: [ConfirmationService],
  exports: [ConfirmationService],
})
export class ConfirmationModule {}
