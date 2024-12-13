import { forwardRef, Module } from '@nestjs/common'
import { StoreModule } from '../../store/store.module'
import { AuthService } from './auth.service'
import { ToolsModule } from '../tools/tools.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { ConfirmationModule } from '../confirmation/confirmation.module'

@Module({
  imports: [StoreModule, ToolsModule, UserModule, ConfirmationModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
