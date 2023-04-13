import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTestE2eController } from './app-test-e2e.controller';
import { AppTestE2eService } from './app-test-e2e.service';
import { AppModule } from '../../src/app.module';
import CompanyEntity from '../../src/api/entities-to-create/company.entity';
import { CompanyEmployeeEntity } from '../../src/api/entities-to-create/company-employee.entity';
import { ConnectedCardEntity } from '../../src/api/card/domain/entities/connected-card.entity';
import { ConversationEntity } from '../../src/api/entities-to-create/conversation.entity';
import { DiscountCodeEntity } from '../../src/api/entities-to-create/discount-code.entity';
import { GroupEntity } from '../../src/api/groupe/domain/entities/group.entity';
import { GroupMembershipEntity } from '../../src/api/groupe/domain/entities/group-membership.entity';
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
import { CardEntity } from '../../src/api/card/domain/entities/card.entity';
import { GroupRequestEntity } from '../../src/api/groupe/domain/entities/group-request.entity';
import { UserTestE2eController } from './controller-test/user-test-e2e.controller';
import { OccupationTestE2eController } from './controller-test/occupation-test-e2e.controller';
import { UserTestE2eService } from './service-test/user-test-e2e.service';
import { OccupationTestE2eService } from './service-test/occupation-test-e2e.service';
import { SocialNetworkTestE2eController } from './controller-test/social-network-test-e2e.controller';
import { SocialNetworkTestE2eService } from './service-test/social-network-test-e2e.service';

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
      GroupRequestEntity,
    ]),
  ],
  controllers: [
    AppTestE2eController,
    UserTestE2eController,
    OccupationTestE2eController,
    SocialNetworkTestE2eController,
  ],
  providers: [AppTestE2eService, UserTestE2eService, OccupationTestE2eService, SocialNetworkTestE2eService],
})
export class AppTestE2eModule {}
