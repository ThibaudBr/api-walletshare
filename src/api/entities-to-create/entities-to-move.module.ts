import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './conversation.entity';
import { DiscountCodeEntity } from './discount-code.entity';
import { InvoicesEntity } from './invoices.entity';
import { JoinedConversation } from './joined-conversation.entity';
import { MessageEntity } from './message.entity';
import { PlanEntity } from './plan.entity';
import StripEventEntity from './strip-event.entity';
import { SubscriptionEntity } from './subscription.entity';
import { ReferralCodeEntity } from './referal-code.entity';
import { NotificationEntity } from './notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ________ Entity ________
      ConversationEntity,
      DiscountCodeEntity,
      InvoicesEntity,
      JoinedConversation,
      MessageEntity,
      PlanEntity,
      StripEventEntity,
      SubscriptionEntity,
      ReferralCodeEntity,
      NotificationEntity,
    ]),
  ],
  controllers: [],
  providers: [
    // ________ Service ________
  ],
})
export class EntitiesToMoveModule {}
