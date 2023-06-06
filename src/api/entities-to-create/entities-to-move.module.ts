import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountCodeEntity } from './discount-code.entity';
import { InvoicesEntity } from './invoices.entity';
import { ProductEntity } from '../payment/product/domain/entities/product.entity';
import { SubscriptionEntity } from '../payment/subscription/domain/entities/subscription.entity';
import { ReferralCodeEntity } from '../payment/subscription/domain/entities/referal-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ________ Entity ________
      DiscountCodeEntity,
      InvoicesEntity,
      ProductEntity,
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
