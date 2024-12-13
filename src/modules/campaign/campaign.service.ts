import { Injectable, Logger } from '@nestjs/common'
import { CampaignServiceStore } from '../../store/campaign/campaign.service'
import { Campaign } from '../../store/campaign/campaign.entity'
import { FindCampaignDto } from './dto/find.campaign.dto'

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name)
  constructor(private readonly campaignStore: CampaignServiceStore) {}

  async retrieveAllCampaigns(): Promise<Array<Campaign>> {
    return this.campaignStore.getAll()
  }

  async getMainCampaign(): Promise<Campaign> {
    return this.campaignStore.getMain()
  }

  async revealCampaignById(id: string): Promise<Campaign> {
    try {
      return this.campaignStore.findById(id)
    } catch (error) {
      this.logger.error(`Cannot find campaign with id [${id}]:`, error)
      throw error
    }
  }

  async revealCampaigns(params: FindCampaignDto): Promise<Array<Campaign>> {
    if (Object.keys(params).length == 0) {
      return []
    }
    return this.campaignStore.findCampaignsByParams(params)
  }
}
