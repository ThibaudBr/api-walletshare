import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import * as admin from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import TokenMessage = messaging.TokenMessage;

@EventSubscriber()
export class FcmNotificationSubscriber implements EntitySubscriberInterface<NotificationEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return NotificationEntity;
  }

  async afterInsert(event: InsertEvent<NotificationEntity>): Promise<void> {
    try {
      const notification: NotificationEntity | undefined = event.entity;
      const userRepository: Repository<UserEntity> = event.manager.getRepository(UserEntity);
      const userEntity: UserEntity | null = await userRepository.findOne({
        where: {
          id: notification?.user.id,
        },
      });
      if (!userEntity) return;
      if (userEntity?.fcmToken) {
        let title = '';
        let description = '';
        switch (notification?.type) {
          case 'NEW_MESSAGE':
            title = 'Nouveau message';
            description = 'Vous avez reçu un nouveau message';
            break;
          case 'INFO':
            title = 'Informations';
            description = notification?.description;
            break;
          case 'WARNING':
            title = 'Warning';
            description = notification?.description;
            break;
          case 'ERROR':
            title = 'Error';
            description = notification?.description;
            break;
          case 'JOIN_NEW_GROUP':
            title = 'Vous avez été ajouté à un groupe';
            description = 'Vous avez été ajouté à un groupe';
            break;
          case 'NEW_GROUP_MESSAGE':
            title = 'Nouveau message dans un groupe';
            description = 'Vous avez reçu un nouveau message dans un groupe';
            break;
          default:
            title = 'Notification';
            description = 'Vous avez reçu une notification';
            break;
        }
        const message: TokenMessage = {
          notification: {
            title: title,
            body: description,
          },
          data: {
            type: notification?.type,
            notificationId: notification?.id,
            conversationId: notification?.conversationId ?? 'not-conversation',
          },
          token: userEntity.fcmToken,
        };
        await admin.messaging().send(message);
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
}
