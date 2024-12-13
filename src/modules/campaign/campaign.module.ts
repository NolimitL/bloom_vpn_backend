import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CampaignService } from './campaign.service'
import { StoreModule } from '../../store/store.module'

@Module({
  imports: [StoreModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
