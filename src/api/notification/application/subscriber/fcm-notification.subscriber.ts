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
    const notification: NotificationEntity | undefined = event.entity;
    const userRepository: Repository<UserEntity> = event.manager.getRepository(UserEntity);
    const userEntity: UserEntity | null = await userRepository.findOne({
      where: {
        id: notification?.user.id,
      },
    });
    if (!userEntity) return;
    if (userEntity?.fcmToken) {
      const message: TokenMessage = {
        notification: {
          title: notification?.title,
          body: notification?.description,
        },
        data: {
          type: notification?.type,
          notificationId: notification?.id,
        },
        token: userEntity.fcmToken,
      };
      await admin.messaging().send(message);
    }
  }
}
