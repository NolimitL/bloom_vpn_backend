import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { CampaignService } from './campaign.service'
import { Campaign } from '../../store/campaign/campaign.entity'
import { FindCampaignDto } from './dto/find.campaign.dto'
import { CountryCode } from '../../common/enums/countries.code.enum'
import { TokenGuard } from '../../common/guards/token.guard'

@UseGuards(TokenGuard)
@Controller('/campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  // TODO setup privileges to reveal all campaign
  // @Get('/all')
  // async getAllCampaigns(): Promise<Array<Campaign>> {
  //   return this.campaignService.retrieveAllCampaigns()
  // }

  @Get('/main')
  async getMainCampaign(): Promise<Campaign> {
    return this.campaignService.getMainCampaign()
  }

  @Get('/find/:id')
  async getCampaign(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.revealCampaignById(id)
  }

  @Get()
  async findCampaign(
    @Query('localization') localization: CountryCode,
    @Query('period') period: string
  ): Promise<Array<Campaign>> {
    const findParams = new FindCampaignDto({
      localization,
      period: Number(period),
    })
    return this.campaignService.revealCampaigns(findParams)
  }
}
