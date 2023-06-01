import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountCodeEntity } from './discount-code.entity';
import { InvoicesEntity } from './invoices.entity';
import { PlanEntity } from './plan.entity';
import { SubscriptionEntity } from './subscription.entity';
import { ReferralCodeEntity } from './referal-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ________ Entity ________
      DiscountCodeEntity,
      InvoicesEntity,
      PlanEntity,
      SubscriptionEntity,
      ReferralCodeEntity,
    ]),
  ],
  controllers: [],
  providers: [
    // ________ Service ________
  ],
})
export class EntitiesToMoveModule {}
