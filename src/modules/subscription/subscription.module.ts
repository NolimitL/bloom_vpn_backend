import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { StoreModule } from '../../store/store.module'
import { ToolsModule } from '../tools/tools.module'

@Module({
  imports: [StoreModule, ToolsModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
