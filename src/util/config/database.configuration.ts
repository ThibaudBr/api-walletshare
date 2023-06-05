import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { logger } from './winston-logger.config';
import { CompanyEntity } from '../../api/company/domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../../api/company/domain/entities/company-employee.entity';
import { ConnectedCardEntity } from '../../api/card/domain/entities/connected-card.entity';
import { ConversationEntity } from '../../api/conversation/domain/entities/conversation.entity';
import { DiscountCodeEntity } from '../../api/entities-to-create/discount-code.entity';
import { GroupEntity } from '../../api/groupe/domain/entities/group.entity';
import { GroupMembershipEntity } from '../../api/groupe/domain/entities/group-membership.entity';
import { InvoicesEntity } from '../../api/entities-to-create/invoices.entity';
import { JoinedConversationEntity } from '../../api/conversation/domain/entities/joined-conversation.entity';
import { MediaEntity } from '../../api/media/domain/entities/media.entity';
import { MessageEntity } from '../../api/conversation/domain/entities/message.entity';
import { OccupationEntity } from '../../api/occupation/domain/entities/occupation.entity';
import { ProductEntity } from '../../api/payment/product/domain/entities/product.entity';
import { ProfileEntity } from '../../api/profile/domain/entities/profile.entity';
import { SocialNetworkEntity } from '../../api/social-network/domain/entities/social-network.entity';
import StripeEventEntity from '../../api/payment/stripe-webhook/domain/entities/stripe-event.entity';
import { SubscriptionEntity } from '../../api/payment/subscription/domain/entities/subscription.entity';
import { UserEntity } from '../../api/user/domain/entities/user.entity';
import { ReferralCodeEntity } from '../../api/entities-to-create/referal-code.entity';
import { NotificationEntity } from '../../api/notification/domain/entities/notification.entity';
import { AddressEntity } from '../../api/address/domain/entities/address.entity';
import { CardEntity } from '../../api/card/domain/entities/card.entity';
import { ProfileSubscriber } from '../../api/profile/application/subscriber/profile.subscriber';
import { ConnectedCardSubscriber } from '../../api/card/application/subscriber/connected-card.subscriber';
import { ProfileCardSubscriber } from '../../api/card/application/subscriber/profile-card.subscriber';
import { GroupMembershipCardSubscriber } from '../../api/groupe/application/subscriber/group-card.subscriber';
import { GroupGroupMembershipSubscriber } from '../../api/groupe/application/subscriber/group-group-membership.subscriber';
import { CardViewSubscriber } from '../../api/card/application/subscriber/card-view.subscriber';
import { CardViewEntity } from '../../api/card/domain/entities/card-view.entity';
import { CompanyAddressSubscriber } from '../../api/address/application/subscriber/company-address.subscriber';
import { UserAddressSubscriber } from '../../api/address/application/subscriber/user-address.subscriber';
import { CompanyCompanyEmployeeSubscriber } from '../../api/company/application/subscriber/company-company-employee.subscriber';
import { ProfileCompanyEmployeeSubscriber } from '../../api/company/application/subscriber/profile-company-employee.subscriber';
import { CardMediaSubscriber } from '../../api/media/application/subscriber/card-media.subscriber';
import { CompanyMediaSubscriber } from '../../api/media/application/subscriber/company-media.subscriber';
import { ProfileMediaSubscriber } from '../../api/media/application/subscriber/profile-media.subscriber';
import { UserLoginEntity } from '../../api/user/domain/entities/user-login.entity';
import { ConversationConnectedCardSubscriber } from '../../api/conversation/application/subscriber/conversation-connected-card.subscriber';
import { ConversationGroupSubscriber } from '../../api/conversation/application/subscriber/conversation-group.subscriber';
import { MessageConversationSubscriber } from '../../api/conversation/application/subscriber/message-conversation.subscriber';
import { NotificationGroupSubscriber } from '../../api/notification/application/subscriber/notification-group.subscriber';
import { NotificationGroupMembershipSubscriber } from '../../api/notification/application/subscriber/notification-group-membership.subscriber';
import { NotificationMessageSubscriber } from '../../api/notification/application/subscriber/notification-message.subscriber';
import { NotificationProfileSubscriber } from '../../api/notification/application/subscriber/notification-profile.subscriber';
import { NotificationUserSubscriber } from '../../api/notification/application/subscriber/notification-user.subscriber';
import { ConfigService } from '@nestjs/config';
import {PriceEntity} from "../../api/payment/price/domain/entities/price.entity";

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    try {
      if (this.configService.get('NODE_ENV') === 'prod') {
        logger.info('NODE_ENV is prod');
        return {
          type: 'postgres',
          host: this.configService.get('TYPEORM_HOST_PROD'),
          port: this.configService.get('TYPEORM_PORT_PROD'),
          username: this.configService.get('TYPEORM_USERNAME_PROD'),
          password: this.configService.get('TYPEORM_PASSWORD_PROD'),
          database: this.configService.get('TYPEORM_DATABASE_PROD'),
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
          entities: [
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
          ],
          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_PROD'),
          logging: this.configService.get('TYPEORM_LOGGING_PROD'),
          subscribers: [
            ProfileSubscriber,
            ConnectedCardSubscriber,
            ProfileCardSubscriber,
            GroupMembershipCardSubscriber,
            GroupGroupMembershipSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            UserAddressSubscriber,
            CompanyCompanyEmployeeSubscriber,
            ProfileCompanyEmployeeSubscriber,
            CardMediaSubscriber,
            CompanyMediaSubscriber,
            ProfileMediaSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            MessageConversationSubscriber,
            NotificationGroupSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
          ],
        };
      } else if (this.configService.get('NODE_ENV') === 'pprod') {
        logger.info('NODE_ENV is pprod');
        return {
          type: 'postgres',
          host: this.configService.get('TYPEORM_HOST_PPROD'),
          port: this.configService.get('TYPEORM_PORT_PPROD'),
          username: this.configService.get('TYPEORM_USERNAME_PPROD'),
          password: this.configService.get('TYPEORM_PASSWORD_PPROD'),
          database: this.configService.get('TYPEORM_DATABASE_PPROD'),
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
          entities: [
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
          ],
          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_PPROD'),
          logging: this.configService.get('TYPEORM_LOGGING_PPROD'),
          subscribers: [
            ProfileSubscriber,
            ConnectedCardSubscriber,
            ProfileCardSubscriber,
            GroupMembershipCardSubscriber,
            GroupGroupMembershipSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            UserAddressSubscriber,
            CompanyCompanyEmployeeSubscriber,
            ProfileCompanyEmployeeSubscriber,
            CardMediaSubscriber,
            CompanyMediaSubscriber,
            ProfileMediaSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            MessageConversationSubscriber,
            NotificationGroupSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
          ],
        };
      } else if (this.configService.get('NODE_ENV') === 'test') {
        logger.info('NODE_ENV is test');
        return {
          type: 'postgres',
          host: this.configService.get('TYPEORM_HOST_TEST'),
          port: this.configService.get('TYPEORM_PORT_TEST'),
          username: this.configService.get('TYPEORM_USERNAME_TEST'),
          password: this.configService.get('TYPEORM_PASSWORD_TEST'),
          database: this.configService.get('TYPEORM_DATABASE_TEST'),
          entities: [
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
          ],
          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_TEST'),
          logging: this.configService.get('TYPEORM_LOGGING_TEST'),
          subscribers: [
            ProfileSubscriber,
            ConnectedCardSubscriber,
            ProfileCardSubscriber,
            GroupMembershipCardSubscriber,
            GroupGroupMembershipSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            UserAddressSubscriber,
            CompanyCompanyEmployeeSubscriber,
            ProfileCompanyEmployeeSubscriber,
            CardMediaSubscriber,
            CompanyMediaSubscriber,
            ProfileMediaSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            MessageConversationSubscriber,
            NotificationGroupSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
          ],
        };
      } else if (this.configService.get('NODE_ENV') === 'dev') {
        logger.info('NODE_ENV is dev');
        return {
          type: 'postgres',
          host: this.configService.get('TYPEORM_HOST_DEV'),
          port: this.configService.get('TYPEORM_PORT_DEV'),
          username: this.configService.get('TYPEORM_USERNAME_DEV'),
          password: this.configService.get('TYPEORM_PASSWORD_DEV'),
          database: this.configService.get('TYPEORM_DATABASE_DEV'),
          logging: this.configService.get('TYPEORM_LOGGING_DEV'),
          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_DEV'),
          entities: [
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
          ],
          subscribers: [
            ProfileSubscriber,
            ConnectedCardSubscriber,
            ProfileCardSubscriber,
            GroupMembershipCardSubscriber,
            GroupGroupMembershipSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            UserAddressSubscriber,
            CompanyCompanyEmployeeSubscriber,
            ProfileCompanyEmployeeSubscriber,
            CardMediaSubscriber,
            CompanyMediaSubscriber,
            ProfileMediaSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            MessageConversationSubscriber,
            NotificationGroupSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
          ],
        };
      } else {
        logger.error('NODE_ENV is not set');
        return {};
      }
    } catch (error) {
      logger.error('An error occurred while trying to connect to the database: ', error);
      throw new Error('NODE_ENV is not set');
    }
  }
}
