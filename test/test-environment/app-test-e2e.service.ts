import { Injectable } from '@nestjs/common';
import { AddressEntity } from '../../src/api/entities-to-create/address.entity';
import StripEventEntity from '../../src/api/entities-to-create/strip-event.entity';
import { ReferralCodeEntity } from '../../src/api/entities-to-create/referal-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedConversation } from '../../src/api/entities-to-create/joined-conversation.entity';
import { SocialNetworkEntity } from '../../src/api/social-network/domain/entities/social-network.entity';
import { SubscriptionEntity } from '../../src/api/entities-to-create/subscription.entity';
import { GroupMembershipEntity } from '../../src/api/entities-to-create/group-membership.entity';
import { CardEntity } from '../../src/api/entities-to-create/card.entity';
import { UserEntity } from '../../src/api/user/domain/entities/user.entity';
import { ProfileEntity } from '../../src/api/profile/domain/entities/profile.entity';
import { DiscountCodeEntity } from '../../src/api/entities-to-create/discount-code.entity';
import { MessageEntity } from '../../src/api/entities-to-create/message.entity';
import { GroupEntity } from '../../src/api/entities-to-create/group.entity';
import CompanyEntity from '../../src/api/entities-to-create/company.entity';
import { CompanyEmployeeEntity } from '../../src/api/entities-to-create/company-employee.entity';
import { PlanEntity } from '../../src/api/entities-to-create/plan.entity';
import { ConversationEntity } from '../../src/api/entities-to-create/conversation.entity';
import { InvoicesEntity } from '../../src/api/entities-to-create/invoices.entity';
import { NotificationEntity } from '../../src/api/entities-to-create/notification.entity';
import { ConnectedCardEntity } from '../../src/api/entities-to-create/connected-card.entity';
import { MediaEntity } from '../../src/api/entities-to-create/media.entity';
import { OccupationEntity } from '../../src/api/occupation/domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../src/api/user/domain/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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
    @InjectRepository(JoinedConversation)
    private readonly joinedConversationRepository: Repository<JoinedConversation>,
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
    await this.userRepository.query('DELETE FROM "user";');
    await this.cardRepository.query('DELETE FROM "card";');
    await this.companyRepository.query('DELETE FROM "company";');
    await this.companyEmployeeRepository.query('DELETE FROM "company_employee";');
    await this.connectedCardRepository.query('DELETE FROM "connected_card";');
    await this.conversationRepository.query('DELETE FROM "conversation";');
    await this.discountCodeRepository.query('DELETE FROM "discount_codes";');
    await this.groupRepository.query('DELETE FROM "group";');
    await this.groupMembershipRepository.query('DELETE FROM "group_membership";');
    await this.invoicesRepository.query('DELETE FROM "invoices";');
    await this.joinedConversationRepository.query('DELETE FROM "joined_conversation";');
    await this.mediaRepository.query('DELETE FROM "media";');
    await this.messageRepository.query('DELETE FROM "message";');
    await this.occupationRepository.query('DELETE FROM "occupation";');
    await this.planRepository.query('DELETE FROM "plan";');
    await this.profileRepository.query('DELETE FROM "profile";');
    await this.socialNetworkRepository.query('DELETE FROM "social_network";');
    await this.stripEventRepository.query('DELETE FROM "strip_event";');
    await this.subscriptionRepository.query('DELETE FROM "subscription";');
    await this.notificationRepository.query('DELETE FROM "notification";');
    await this.referralCodeRepository.query('DELETE FROM "referral_code";');
    await this.addressRepository.query('DELETE FROM "address";');

    return;
  }

  async createUserTest(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userRepository.save({
      username: createUserDto.username,
      mail: createUserDto.mail,
      password: bcrypt.hashSync(createUserDto.password, 10),
      roles: createUserDto.roles,
    });
  }

  async removeUser(userId: string): Promise<void> {
    await this.userRepository.softDelete({ id: userId });
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      withDeleted: true,
    });
  }
}
