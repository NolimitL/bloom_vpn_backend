import { Module } from '@nestjs/common'
import { storageProviders } from './store.provider'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Intention } from './intention/intention.entity'
import { IntentionServiceStore } from './intention/intention.service'
import { User } from './user/user.entity'
import { UserServiceStore } from './user/user.service'
import { Product } from './product/product.entity'
import { ProductServiceStore } from './product/product.service'
import { Subscription } from './subscription/subscription.entity'
import { SubscriptionServiceStore } from './subscription/subscription.service'
import { AccessKey } from './access-key/access-key.entity'
import { AccessKeyServiceStore } from './access-key/access-key.service'
import { Price } from './price/price.entity'
import { PriceServiceStore } from './price/price.service'
import { Campaign } from './campaign/campaign.entity'
import { CampaignServiceStore } from './campaign/campaign.service'
import { CampaignProducts } from './_junctions/campaign_products.junction.entity'

@Module({
  imports: [
    ...storageProviders,
    TypeOrmModule.forFeature([
      Intention,
      User,
      Product,
      Price,
      Subscription,
      AccessKey,
      Campaign,
      CampaignProducts,
    ]),
  ],
  providers: [
    IntentionServiceStore,
    UserServiceStore,
    ProductServiceStore,
    PriceServiceStore,
    SubscriptionServiceStore,
    AccessKeyServiceStore,
    CampaignServiceStore,
  ],
  exports: [
    IntentionServiceStore,
    UserServiceStore,
    ProductServiceStore,
    PriceServiceStore,
    SubscriptionServiceStore,
    AccessKeyServiceStore,
    CampaignServiceStore,
  ],
})
export class StoreModule {}
