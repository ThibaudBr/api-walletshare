import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { logger } from './winston-logger.config';
import { CompanyEntity } from '../../api/company/domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../../api/company/domain/entities/company-employee.entity';
import { ConnectedCardEntity } from '../../api/card/domain/entities/connected-card.entity';
import { ConversationEntity } from '../../api/conversation/domain/entities/conversation.entity';
import { GroupEntity } from '../../api/groupe/domain/entities/group.entity';
import { GroupMembershipEntity } from '../../api/groupe/domain/entities/group-membership.entity';
import { InvoicesEntity } from '../../api/payment/invoices/domain/entities/invoices.entity';
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
import { ReferralCodeEntity } from '../../api/user/domain/entities/referral-code.entity';
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
import { CompanyEmployeeProfile } from '../../api/company/application/subscriber/company-employee-profile';
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
import { PriceEntity } from '../../api/payment/price/domain/entities/price.entity';
import { CardPresetEntity } from '../../api/company/domain/entities/card-preset.entity';
import { CompanyCardPresetSubscriber } from '../../api/company/application/subscriber/company-card-preset.subscriber';
import { UserReferralCodeSubscriber } from '../../api/user/application/subscriber/user-referral-code.subscriber';
import { ConnectedUserEntity } from '../../api/conversation/domain/entities/connected-user.entity';
import { CardPresetCardSubscriber } from '../../api/card/application/subscriber/card-preset-card.subscriber';
import { CardPresetMediaSubscriber } from '../../api/media/application/subscriber/card-preset-media.subscriber';
import { GroupMediaSubscriber } from '../../api/media/application/subscriber/group-media.subscriber';

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    try {
      if (this.configService.get('NODE_ENV') === 'prod') {
        logger.info('NODE_ENV is prod');
        return {
          database: this.configService.get('TYPEORM_DATABASE_PROD'),
          entities: [
            AddressEntity,
            CardEntity,
            CardPresetEntity,
            CardViewEntity,
            CompanyEmployeeEntity,
            CompanyEntity,
            ConnectedCardEntity,
            ConnectedUserEntity,
            ConversationEntity,
            GroupEntity,
            GroupMembershipEntity,
            InvoicesEntity,
            JoinedConversationEntity,
            MediaEntity,
            MessageEntity,
            NotificationEntity,
            OccupationEntity,
            PriceEntity,
            ProductEntity,
            ProfileEntity,
            ReferralCodeEntity,
            SocialNetworkEntity,
            StripeEventEntity,
            SubscriptionEntity,
            UserEntity,
            UserLoginEntity,
          ],
          host: this.configService.get('TYPEORM_HOST_PROD'),
          logging: this.configService.get('TYPEORM_LOGGING_PROD'),
          password: this.configService.get('TYPEORM_PASSWORD_PROD'),
          port: this.configService.get('TYPEORM_PORT_PROD'),
          subscribers: [
            CardMediaSubscriber,
            CardPresetCardSubscriber,
            CardPresetMediaSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            CompanyCardPresetSubscriber,
            CompanyCompanyEmployeeSubscriber,
            CompanyMediaSubscriber,
            ConnectedCardSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            GroupGroupMembershipSubscriber,
            GroupMediaSubscriber,
            GroupMembershipCardSubscriber,
            MessageConversationSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationGroupSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
            ProfileCardSubscriber,
            CompanyEmployeeProfile,
            ProfileMediaSubscriber,
            ProfileSubscriber,
            UserAddressSubscriber,
            UserReferralCodeSubscriber,
          ],
          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_PROD'),
          type: 'postgres',
          username: this.configService.get('TYPEORM_USERNAME_PROD'),
        };
      } else if (this.configService.get('NODE_ENV') === 'pprod') {
        logger.info('NODE_ENV is pprod');
        return {
          database: this.configService.get('TYPEORM_DATABASE_PPROD'),
          entities: [
            AddressEntity,
            CardEntity,
            CardPresetEntity,
            CardViewEntity,
            CompanyEmployeeEntity,
            CompanyEntity,
            ConnectedCardEntity,
            ConnectedUserEntity,
            ConversationEntity,
            GroupEntity,
            GroupMembershipEntity,
            InvoicesEntity,
            JoinedConversationEntity,
            MediaEntity,
            MessageEntity,
            NotificationEntity,
            OccupationEntity,
            PriceEntity,
            ProductEntity,
            ProfileEntity,
            ReferralCodeEntity,
            SocialNetworkEntity,
            StripeEventEntity,
            SubscriptionEntity,
            UserEntity,
            UserLoginEntity,
          ],
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
          host: this.configService.get('TYPEORM_HOST_PPROD'),
          logging: this.configService.get('TYPEORM_LOGGING_PPROD'),
          password: this.configService.get('TYPEORM_PASSWORD_PPROD'),
          port: this.configService.get('TYPEORM_PORT_PPROD'),
          ssl: true,
          subscribers: [
            CardMediaSubscriber,
            CardPresetCardSubscriber,
            CardPresetMediaSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            CompanyCardPresetSubscriber,
            CompanyCompanyEmployeeSubscriber,
            CompanyMediaSubscriber,
            ConnectedCardSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            GroupGroupMembershipSubscriber,
            GroupMediaSubscriber,
            GroupMembershipCardSubscriber,
            MessageConversationSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationGroupSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
            ProfileCardSubscriber,
            CompanyEmployeeProfile,
            ProfileMediaSubscriber,
            ProfileSubscriber,
            UserAddressSubscriber,
            UserReferralCodeSubscriber,
          ],

          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_PPROD'),
          type: 'postgres',
          username: this.configService.get('TYPEORM_USERNAME_PPROD'),
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
            AddressEntity,
            CardEntity,
            CardPresetEntity,
            CardViewEntity,
            CompanyEmployeeEntity,
            CompanyEntity,
            ConnectedCardEntity,
            ConnectedUserEntity,
            ConversationEntity,
            GroupEntity,
            GroupMembershipEntity,
            InvoicesEntity,
            JoinedConversationEntity,
            MediaEntity,
            MessageEntity,
            NotificationEntity,
            OccupationEntity,
            PriceEntity,
            ProductEntity,
            ProfileEntity,
            ReferralCodeEntity,
            SocialNetworkEntity,
            StripeEventEntity,
            SubscriptionEntity,
            UserEntity,
            UserLoginEntity,
          ],
          synchronize: this.configService.get('TYPEORM_SYNCHRONIZE_TEST'),
          logging: this.configService.get('TYPEORM_LOGGING_TEST'),
          subscribers: [
            CardMediaSubscriber,
            CardPresetCardSubscriber,
            CardPresetMediaSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            CompanyCardPresetSubscriber,
            CompanyCompanyEmployeeSubscriber,
            CompanyMediaSubscriber,
            ConnectedCardSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            GroupGroupMembershipSubscriber,
            GroupMediaSubscriber,
            GroupMembershipCardSubscriber,
            MessageConversationSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationGroupSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
            ProfileCardSubscriber,
            CompanyEmployeeProfile,
            ProfileMediaSubscriber,
            ProfileSubscriber,
            UserAddressSubscriber,
            UserReferralCodeSubscriber,
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
            AddressEntity,
            CardEntity,
            CardPresetEntity,
            CardViewEntity,
            CompanyEmployeeEntity,
            CompanyEntity,
            ConnectedCardEntity,
            ConnectedUserEntity,
            ConversationEntity,
            GroupEntity,
            GroupMembershipEntity,
            InvoicesEntity,
            JoinedConversationEntity,
            MediaEntity,
            MessageEntity,
            NotificationEntity,
            OccupationEntity,
            PriceEntity,
            ProductEntity,
            ProfileEntity,
            ReferralCodeEntity,
            SocialNetworkEntity,
            StripeEventEntity,
            SubscriptionEntity,
            UserEntity,
            UserLoginEntity,
          ],
          subscribers: [
            CardMediaSubscriber,
            CardPresetCardSubscriber,
            CardPresetMediaSubscriber,
            CardViewSubscriber,
            CompanyAddressSubscriber,
            CompanyCardPresetSubscriber,
            CompanyCompanyEmployeeSubscriber,
            CompanyMediaSubscriber,
            ConnectedCardSubscriber,
            ConversationConnectedCardSubscriber,
            ConversationGroupSubscriber,
            GroupGroupMembershipSubscriber,
            GroupMediaSubscriber,
            GroupMembershipCardSubscriber,
            MessageConversationSubscriber,
            NotificationGroupMembershipSubscriber,
            NotificationGroupSubscriber,
            NotificationMessageSubscriber,
            NotificationProfileSubscriber,
            NotificationUserSubscriber,
            ProfileCardSubscriber,
            CompanyEmployeeProfile,
            ProfileMediaSubscriber,
            ProfileSubscriber,
            UserAddressSubscriber,
            UserReferralCodeSubscriber,
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
