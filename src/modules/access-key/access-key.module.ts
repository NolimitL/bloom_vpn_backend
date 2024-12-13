import { Module } from '@nestjs/common'
import { AccessKeyController } from './access-key.controller'
import { AccessKeyService } from './access-key.service'
import { StoreModule } from '../../store/store.module'
import { ToolsModule } from '../tools/tools.module'

@Module({
  imports: [StoreModule, ToolsModule],
  controllers: [AccessKeyController],
  providers: [AccessKeyService],
  exports: [AccessKeyService],
})
export class AccessKeyModule {}
