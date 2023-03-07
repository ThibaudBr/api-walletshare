import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import CompanyEntity from './company.entity';
import { CompanyEmployeeEntity } from './company-employee.entity';
import { ConnectedCardEntity } from './connected-card.entity';
import { ConversationEntity } from './conversation.entity';
import { DiscountCodeEntity } from './discount-code.entity';
import { GroupEntity } from './group.entity';
import { GroupMembershipEntity } from './group-membership.entity';
import { InvoicesEntity } from './invoices.entity';
import { JoinedConversation } from './joined-conversation.entity';
import { MediaEntity } from './media.entity';
import { MessageEntity } from './message.entity';
import { OccupationEntity } from './occupation.entity';
import { PlanEntity } from './plan.entity';
import { ProfileEntity } from './profile.entity';
import { SocialNetworkEntity } from './social-network.entity';
import StripEventEntity from './strip-event.entity';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ________ Entity ________
      CardEntity,
      CompanyEntity,
      CompanyEmployeeEntity,
      ConnectedCardEntity,
      ConversationEntity,
      DiscountCodeEntity,
      GroupEntity,
      GroupMembershipEntity,
      InvoicesEntity,
      JoinedConversation,
      MediaEntity,
      MessageEntity,
      OccupationEntity,
      PlanEntity,
      ProfileEntity,
      SocialNetworkEntity,
      StripEventEntity,
      SubscriptionEntity,
      UserEntity,
    ]),
  ],
  controllers: [],
  providers: [
    // ________ Service ________
  ],
})
export class EntitiesToMoveModule {
}
