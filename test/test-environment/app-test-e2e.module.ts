import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTestE2eController } from './controller-test/app-test-e2e.controller';
import { AppTestE2eService } from './service-test/app-test-e2e.service';
import { AppModule } from '../../src/app.module';
import { CompanyEntity } from '../../src/api/company/domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../../src/api/company/domain/entities/company-employee.entity';
import { ConnectedCardEntity } from '../../src/api/card/domain/entities/connected-card.entity';
import { ConversationEntity } from '../../src/api/conversation/domain/entities/conversation.entity';
import { DiscountCodeEntity } from '../../src/api/entities-to-create/discount-code.entity';
import { GroupEntity } from '../../src/api/groupe/domain/entities/group.entity';
import { GroupMembershipEntity } from '../../src/api/groupe/domain/entities/group-membership.entity';
import { InvoicesEntity } from '../../src/api/payment/invoices/domain/entities/invoices.entity';
import { JoinedConversationEntity } from '../../src/api/conversation/domain/entities/joined-conversation.entity';
import { MediaEntity } from '../../src/api/media/domain/entities/media.entity';
import { MessageEntity } from '../../src/api/conversation/domain/entities/message.entity';
import { OccupationEntity } from '../../src/api/occupation/domain/entities/occupation.entity';
import { ProductEntity } from '../../src/api/payment/product/domain/entities/product.entity';
import { ProfileEntity } from '../../src/api/profile/domain/entities/profile.entity';
import { SocialNetworkEntity } from '../../src/api/social-network/domain/entities/social-network.entity';
import StripeEventEntity from '../../src/api/payment/stripe-webhook/domain/entities/stripe-event.entity';
import { SubscriptionEntity } from '../../src/api/payment/subscription/domain/entities/subscription.entity';
import { UserEntity } from '../../src/api/user/domain/entities/user.entity';
import { NotificationEntity } from '../../src/api/notification/domain/entities/notification.entity';
import { ReferralCodeEntity } from '../../src/api/payment/subscription/domain/entities/referal-code.entity';
import { AddressEntity } from '../../src/api/address/domain/entities/address.entity';
import { CardEntity } from '../../src/api/card/domain/entities/card.entity';
import { UserTestE2eController } from './controller-test/user-test-e2e.controller';
import { OccupationTestE2eController } from './controller-test/occupation-test-e2e.controller';
import { UserTestE2eService } from './service-test/user-test-e2e.service';
import { OccupationTestE2eService } from './service-test/occupation-test-e2e.service';
import { SocialNetworkTestE2eController } from './controller-test/social-network-test-e2e.controller';
import { SocialNetworkTestE2eService } from './service-test/social-network-test-e2e.service';
import { ProfileTestE2eController } from './controller-test/profile-test-e2e.controller';
import { ProfileTestE2eService } from './service-test/profile-test-e2e.service';
import { CardTestE2eController } from './controller-test/card-test-e2e.controller';
import { CardTestE2eService } from './service-test/card-test-e2e.service';
import { GroupTestE2eController } from './controller-test/group-test-e2e.controller';
import { GroupTestE2eService } from './service-test/group-test-e2e.service';
import { CardViewEntity } from '../../src/api/card/domain/entities/card-view.entity';
import { ConfigModule } from '@nestjs/config';
import {UserLoginEntity} from "../../src/api/user/domain/entities/user-login.entity";
import {PriceEntity} from "../../src/api/payment/price/domain/entities/price.entity";

@Module({
  imports: [
    ConfigModule,
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
      JoinedConversationEntity,
      MediaEntity,
      MessageEntity,
      OccupationEntity,
      ProductEntity,
      ProfileEntity,
      SocialNetworkEntity,
      StripeEventEntity,
      SubscriptionEntity,
      UserEntity,
      NotificationEntity,
      ReferralCodeEntity,
      AddressEntity,
      CardViewEntity,
      UserLoginEntity,
      PriceEntity,
    ]),
  ],
  controllers: [
    AppTestE2eController,
    UserTestE2eController,
    OccupationTestE2eController,
    SocialNetworkTestE2eController,
    ProfileTestE2eController,
    CardTestE2eController,
    GroupTestE2eController,
  ],
  providers: [
    AppTestE2eService,
    UserTestE2eService,
    OccupationTestE2eService,
    SocialNetworkTestE2eService,
    ProfileTestE2eService,
    CardTestE2eService,
    GroupTestE2eService,
  ],
})
export class AppTestE2eModule {}
