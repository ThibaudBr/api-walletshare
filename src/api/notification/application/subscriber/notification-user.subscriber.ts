import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@EventSubscriber()
export class NotificationUserSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const notificationRepository = event.manager.getRepository(NotificationEntity);
    const notifications = await notificationRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (notifications.length == 0) return;
    await notificationRepository.softRemove(notifications);
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const notificationRepository = event.manager.getRepository(NotificationEntity);
    const notifications = await notificationRepository.find({
      relations: ['user'],
      withDeleted: true,
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (notifications.length == 0) return;
    await notificationRepository.remove(notifications);
  }
}
