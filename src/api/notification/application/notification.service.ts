import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NotificationResponse } from '../web/response/notification.response';
import { GetAllNotificationQuery } from './cqrs/query/get-all-notification.query';
import { GetAllNotificationWithUserIdQuery } from './cqrs/query/get-all-notification-with-user-id.query';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { NotificationEntity } from '../domain/entities/notification.entity';
import { ConversationResponse } from '../../conversation/web/response/conversation.response';
import { GroupResponse } from '../../groupe/web/response/group.response';
import { GroupMembershipResponse } from '../../groupe/web/response/group-membership.response';
import { GroupMembershipEntity } from '../../groupe/domain/entities/group-membership.entity';
import { GetAllUnreadNotificationWithUserIdQuery } from './cqrs/query/get-all-unread-notification-with-user-id.query';
import { MarkNotificationAsReadCommand } from './cqrs/command/mark-notification-as-read.command';
import { SoftRemoveNotificationCommand } from './cqrs/command/soft-remove-notification.command';
import { RemoveNotificationCommand } from './cqrs/command/remove-notification.command';
import { RestoreNotificationCommand } from './cqrs/command/restore-notification.command';
import { CreateNotificationAdminRequest } from '../web/request/create-notification-admin.request';
import { CreateNotificationAdminCommand } from './cqrs/command/create-notification-admin.command';

@Injectable()
export class NotificationService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async getAllNotifications(): Promise<NotificationResponse[]> {
    return await this.queryBus.execute(new GetAllNotificationQuery());
  }

  async getAllNotificationsForUser(userId: string): Promise<NotificationResponse[]> {
    return await this.queryBus
      .execute(
        new GetAllNotificationWithUserIdQuery({
          userId: userId,
        }),
      )
      .catch(err => {
        if (err.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw err;
      })
      .then((notificationEntities: NotificationEntity[]) => {
        return notificationEntities.map((notificationEntity: NotificationEntity) => {
          return new NotificationResponse({
            ...notificationEntity,
            conversation: new ConversationResponse({
              ...notificationEntity.group.conversation,
              messages: notificationEntity.group.conversation.messages.map(message => {
                return {
                  ...message,
                  media: undefined,
                  conversation: undefined,
                };
              }),
              group: new GroupResponse({
                ...notificationEntity.group,
                groupMemberships: notificationEntity.group.members.map((groupMembership: GroupMembershipEntity) => {
                  return new GroupMembershipResponse({
                    ...groupMembership,
                  });
                }),
              }),
            }),
          });
        });
      });
  }

  async getUnreadNotificationsForUser(userId: string): Promise<NotificationResponse[]> {
    return await this.queryBus
      .execute(
        new GetAllUnreadNotificationWithUserIdQuery({
          userId: userId,
        }),
      )
      .catch(err => {
        if (err.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw err;
      })
      .then((notificationEntities: NotificationEntity[]) => {
        return notificationEntities.map((notificationEntity: NotificationEntity) => {
          return new NotificationResponse({
            ...notificationEntity,
            conversation: new ConversationResponse({
              ...notificationEntity.group.conversation,
              messages: notificationEntity.group.conversation.messages.map(message => {
                return {
                  ...message,
                  media: undefined,
                  conversation: undefined,
                };
              }),
              group: new GroupResponse({
                ...notificationEntity.group,
                groupMemberships: notificationEntity.group.members.map((groupMembership: GroupMembershipEntity) => {
                  return new GroupMembershipResponse({
                    ...groupMembership,
                  });
                }),
              }),
            }),
          });
        });
      });
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    if (!(await this.isNotificationOwnedByUserId(userId, notificationId))) {
      throw new ForbiddenException('You are not allowed to mark this notification as read');
    }

    return await this.commandBus
      .execute(
        new MarkNotificationAsReadCommand({
          notificationId: notificationId,
        }),
      )
      .catch(err => {
        if (err.message === 'Notification not found') throw new InvalidIdHttpException('Notification not found');
        throw err;
      });
  }

  async softRemoveNotification(notificationId: string): Promise<void> {
    return await this.commandBus
      .execute(
        new SoftRemoveNotificationCommand({
          notificationId: notificationId,
        }),
      )
      .catch(err => {
        if (err.message === 'Notification not found') throw new InvalidIdHttpException('Notification not found');
        throw err;
      });
  }

  async removeNotification(notificationId: string): Promise<void> {
    return await this.commandBus
      .execute(
        new RemoveNotificationCommand({
          notificationId: notificationId,
        }),
      )
      .catch(err => {
        if (err.message === 'Notification not found') throw new InvalidIdHttpException('Notification not found');
        throw err;
      });
  }

  async restoreNotification(notificationId: string): Promise<void> {
    return await this.commandBus
      .execute(
        new RestoreNotificationCommand({
          notificationId: notificationId,
        }),
      )
      .catch(err => {
        if (err.message === 'Notification not found') throw new InvalidIdHttpException('Notification not found');
        throw err;
      });
  }

  async createNotificationAdmin(createNotificationAdminRequest: CreateNotificationAdminRequest): Promise<void> {
    return await this.commandBus
      .execute(
        new CreateNotificationAdminCommand({
          ...createNotificationAdminRequest,
        }),
      )
      .catch(err => {
        if (err.message === 'User not found') throw new InvalidIdHttpException('User not found');
        if (err.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        if (err.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw err;
      });
  }

  async getAllUnreadNotificationCount(): Promise<number> {
    return await this.getAllNotifications().then((notifications: NotificationResponse[]) => {
      return notifications.filter((notification: NotificationResponse) => {
        return !notification.isRead;
      }).length;
    });
  }

  private async isNotificationOwnedByUserId(userId: string, notificationId: string): Promise<boolean> {
    return await this.queryBus
      .execute(
        new GetAllNotificationWithUserIdQuery({
          userId: userId,
        }),
      )
      .catch(err => {
        if (err.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw err;
      })
      .then((notificationEntities: NotificationEntity[]) => {
        return notificationEntities.some((notificationEntity: NotificationEntity) => {
          return notificationEntity.id === notificationId;
        });
      });
  }
}
