import { Injectable } from '@nestjs/common';
import { AddressEntity } from '../../../src/api/address/domain/entities/address.entity';
import StripEventEntity from '../../../src/api/entities-to-create/strip-event.entity';
import { ReferralCodeEntity } from '../../../src/api/entities-to-create/referal-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedConversationEntity } from '../../../src/api/conversation/domain/entities/joined-conversation.entity';
import { SocialNetworkEntity } from '../../../src/api/social-network/domain/entities/social-network.entity';
import { SubscriptionEntity } from '../../../src/api/entities-to-create/subscription.entity';
import { GroupMembershipEntity } from '../../../src/api/groupe/domain/entities/group-membership.entity';
import { UserEntity } from '../../../src/api/user/domain/entities/user.entity';
import { ProfileEntity } from '../../../src/api/profile/domain/entities/profile.entity';
import { DiscountCodeEntity } from '../../../src/api/entities-to-create/discount-code.entity';
import { MessageEntity } from '../../../src/api/conversation/domain/entities/message.entity';
import { GroupEntity } from '../../../src/api/groupe/domain/entities/group.entity';
import { CompanyEntity } from '../../../src/api/company/domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../../../src/api/company/domain/entities/company-employee.entity';
import { PlanEntity } from '../../../src/api/entities-to-create/plan.entity';
import { ConversationEntity } from '../../../src/api/conversation/domain/entities/conversation.entity';
import { InvoicesEntity } from '../../../src/api/entities-to-create/invoices.entity';
import { NotificationEntity } from '../../../src/api/notification/domain/entities/notification.entity';
import { ConnectedCardEntity } from '../../../src/api/card/domain/entities/connected-card.entity';
import { MediaEntity } from '../../../src/api/media/domain/entities/media.entity';
import { OccupationEntity } from '../../../src/api/occupation/domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../src/api/card/domain/entities/card.entity';

@Injectable()
export class AppTestE2eService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeRepository: Repository<CompanyEmployeeEntity>,
    @InjectRepository(ConnectedCardEntity)
    private readonly connectedCardRepository: Repository<ConnectedCardEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(DiscountCodeEntity)
    private readonly discountCodeRepository: Repository<DiscountCodeEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    @InjectRepository(InvoicesEntity)
    private readonly invoicesRepository: Repository<InvoicesEntity>,
    @InjectRepository(JoinedConversationEntity)
    private readonly joinedConversationRepository: Repository<JoinedConversationEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    @InjectRepository(StripEventEntity)
    private readonly stripEventRepository: Repository<StripEventEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(ReferralCodeEntity)
    private readonly referralCodeRepository: Repository<ReferralCodeEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async clearDatabaseTest(): Promise<void> {
    try {
      await this.userRepository.query('DELETE FROM "user-login";');
      await this.mediaRepository.query('DELETE FROM "media";');
      await this.cardRepository.query('DELETE FROM "card_occupations_occupation";');
      await this.cardRepository.query('DELETE FROM "connected_card";');
      await this.cardRepository.query('DELETE FROM "saved-card";');
      await this.cardRepository.query('DELETE FROM "card";');
      await this.cardRepository.query('DELETE FROM "profile-occupation";');
      await this.profileRepository.query('DELETE FROM "profile";');
      await this.companyRepository.query('DELETE FROM "company";');
      await this.companyRepository.query('DELETE FROM "company_occupations_occupation";');
      await this.companyEmployeeRepository.query('DELETE FROM "company_employee";');
      await this.conversationRepository.query('DELETE FROM "conversation";');
      await this.discountCodeRepository.query('DELETE FROM "discount_codes";');
      await this.groupRepository.query('DELETE FROM "group";');
      await this.groupMembershipRepository.query('DELETE FROM "group_membership";');
      await this.invoicesRepository.query('DELETE FROM "invoices";');
      await this.joinedConversationRepository.query('DELETE FROM "joined_conversation";');
      await this.messageRepository.query('DELETE FROM "message";');
      await this.occupationRepository.query('DELETE FROM "occupation";');
      await this.planRepository.query('DELETE FROM "plan";');
      await this.socialNetworkRepository.query('DELETE FROM "social_network";');
      await this.stripEventRepository.query('DELETE FROM "strip_event";');
      await this.subscriptionRepository.query('DELETE FROM "subscription";');
      await this.notificationRepository.query('DELETE FROM "notification";');
      await this.referralCodeRepository.query('DELETE FROM "referral_code";');
      await this.addressRepository.query('DELETE FROM "address";');
      await this.userRepository.query('DELETE FROM "user";');
    } catch (error) {
      console.log(error);
    }
  }
}
