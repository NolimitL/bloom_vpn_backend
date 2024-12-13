import { Module } from '@nestjs/common'
import { StoreModule } from './store/store.module'
import { AccessKeyModule } from './modules/access-key/access-key.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { ToolsModule } from './modules/tools/tools.module'
import { ConfirmationModule } from './modules/confirmation/confirmation.module'
import { IMPORTANT_CONSTANTS } from './app.contansts'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { ProductModule } from './modules/product/product.module'
import { CampaignModule } from './modules/campaign/campaign.module'

@Module({
  imports: [
    StoreModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AccessKeyModule,
    AuthModule,
    UserModule,
    ToolsModule,
    ConfirmationModule,
    ProductModule,
    SubscriptionModule,
    CampaignModule,
  ],
})
export class AppModule {
  constructor() {
    const keys = Object.keys(process.env)
    for (const constant of IMPORTANT_CONSTANTS) {
      if (!keys.includes(constant) || !process.env[constant]) {
        throw new Error(
          `Environment is not correct: constant is absent [${constant}]=[${process.env[constant]}]`
        )
      }
    }
  }
}
