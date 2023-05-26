import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationAdminCommand } from '../../command/create-notification-admin.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { GroupEntity } from '../../../../../groupe/domain/entities/group.entity';
import { CreateNotificationAdminEvent } from '../../event/create-notification-admin.event';

@CommandHandler(CreateNotificationAdminCommand)
export class CreateNotificationAdminCommandHandler implements ICommandHandler<CreateNotificationAdminCommand> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateNotificationAdminCommand): Promise<void> {
    const newNotification = new NotificationEntity({
      type: command.notificationTypeEnum,
      title: command.title,
      description: command.description,
      link: command.link ? command.link : undefined,
    });
    if (command.userIds) {
      for (const userId of command.userIds) {
        const user = await this.userRepository.findOne({
          where: {
            id: userId,
          },
        });
        if (!user) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'CreateNotificationAdminCommandHandler',
              localisation: 'notificationHandler',
              error: 'User with id ' + userId + ' not found',
            }),
          );
          continue;
        }
        newNotification.user = user;
        await this.userRepository.save(newNotification);
      }
    }

    if (command.profileIds) {
      for (const profileId of command.profileIds) {
        const profile = await this.profileRepository.findOne({
          where: {
            id: profileId,
          },
        });
        if (!profile) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'CreateNotificationAdminCommandHandler',
              localisation: 'notificationHandler',
              error: 'Profile with id ' + profileId + ' not found',
            }),
          );
          continue;
        }
        newNotification.profile = profile;
        await this.profileRepository.save(newNotification);
      }
    }

    if (command.groupIds) {
      for (const groupId of command.groupIds) {
        const conversation = await this.groupRepository.findOne({
          where: {
            id: groupId,
          },
        });
        if (!conversation) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'CreateNotificationAdminCommandHandler',
              localisation: 'notificationHandler',
              error: 'Group with id ' + groupId + ' not found',
            }),
          );
          continue;
        }
        newNotification.group = conversation;
        await this.groupRepository.save(newNotification);
      }
    }

    if (command.forAllUser) {
      const users = await this.userRepository.find();
      for (const user of users) {
        newNotification.user = user;
        await this.userRepository.save(newNotification);
      }
    }
    await this.eventBus.publish(
      new CreateNotificationAdminEvent({
        ...command,
      }),
    );
  }
}
