import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTestE2eController } from './app-test-e2e.controller';
import { AppTestE2eService } from './app-test-e2e.service';
import { AppModule } from '../../src/app.module';
import { CardEntity } from '../../src/api/entities-to-create/card.entity';
import CompanyEntity from '../../src/api/entities-to-create/company.entity';
import { CompanyEmployeeEntity } from '../../src/api/entities-to-create/company-employee.entity';
import { ConnectedCardEntity } from '../../src/api/card/domain/entities/connected-card.entity';
import { ConversationEntity } from '../../src/api/entities-to-create/conversation.entity';
import { DiscountCodeEntity } from '../../src/api/entities-to-create/discount-code.entity';
import { GroupEntity } from '../../src/api/entities-to-create/group.entity';
import { GroupMembershipEntity } from '../../src/api/entities-to-create/group-membership.entity';
import { InvoicesEntity } from '../../src/api/entities-to-create/invoices.entity';
import { JoinedConversation } from '../../src/api/entities-to-create/joined-conversation.entity';
import { MediaEntity } from '../../src/api/entities-to-create/media.entity';
import { MessageEntity } from '../../src/api/entities-to-create/message.entity';
import { OccupationEntity } from '../../src/api/occupation/domain/entities/occupation.entity';
import { PlanEntity } from '../../src/api/entities-to-create/plan.entity';
import { ProfileEntity } from '../../src/api/profile/domain/entities/profile.entity';
import { SocialNetworkEntity } from '../../src/api/social-network/domain/entities/social-network.entity';
import StripEventEntity from '../../src/api/entities-to-create/strip-event.entity';
import { SubscriptionEntity } from '../../src/api/entities-to-create/subscription.entity';
import { UserEntity } from '../../src/api/user/domain/entities/user.entity';
import { NotificationEntity } from '../../src/api/entities-to-create/notification.entity';
import { ReferralCodeEntity } from '../../src/api/entities-to-create/referal-code.entity';
import { AddressEntity } from '../../src/api/entities-to-create/address.entity';

@Module({
  imports: [
    AppModule,
    TypeOrmModule.forFeature([
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
      NotificationEntity,
      ReferralCodeEntity,
      AddressEntity,
    ]),
  ],
  controllers: [AppTestE2eController],
  providers: [AppTestE2eService],
})
export class AppTestE2eModule {}
