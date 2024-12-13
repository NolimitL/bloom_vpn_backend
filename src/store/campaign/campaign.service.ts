import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Campaign } from './campaign.entity'
import { FindCampaignDto } from '../../modules/campaign/dto/find.campaign.dto'

@Injectable()
export class CampaignServiceStore {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>
  ) {}

  async getAll(): Promise<Array<Campaign>> {
    return this.campaignRepository.find()
  }

  async getMain(): Promise<Campaign> {
    return this.campaignRepository.findOne({
      where: {
        name: 'Main',
      },
    })
  }

  async findById(id: string): Promise<Campaign> {
    return this.campaignRepository.findOneOrFail({
      where: {
        id,
      },
    })
  }

  async findCampaignsByParams(
    parameters: FindCampaignDto
  ): Promise<Array<Campaign>> {
    return this.campaignRepository.query(
      `SELECT * FROM campaigns WHERE parameters::jsonb->>${Object.entries(
        parameters
      )
        .map(([key, v]) => {
          if (v) {
            return `'${key}' LIKE '${v}'`
          }
        })
        .join(' OR ')}`
    )
  }
}
