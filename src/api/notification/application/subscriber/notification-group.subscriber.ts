import { EntitySubscriberInterface, EventSubscriber, Repository, SoftRemoveEvent } from 'typeorm';
import { GroupEntity } from '../../../groupe/domain/entities/group.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@EventSubscriber()
export class NotificationGroupSubscriber implements EntitySubscriberInterface<GroupEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return GroupEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<GroupEntity>): Promise<void> {
    const softRemovedGroup: GroupEntity | undefined = event.entity;
    const notificationRepository: Repository<NotificationEntity> = event.manager.getRepository(NotificationEntity);
    const notifications: NotificationEntity[] = await notificationRepository.find({
      relations: ['group'],
      where: {
        group: {
          id: softRemovedGroup?.id,
        },
      },
    });
    if (notifications.length == 0) return;
    await notificationRepository.softRemove(notifications);
  }

  async beforeRemove(event: SoftRemoveEvent<GroupEntity>): Promise<void> {
    const softRemovedGroup: GroupEntity | undefined = event.entity;
    const notificationRepository: Repository<NotificationEntity> = event.manager.getRepository(NotificationEntity);
    const notifications: NotificationEntity[] = await notificationRepository.find({
      relations: ['group'],
      withDeleted: true,
      where: {
        group: {
          id: softRemovedGroup?.id,
        },
      },
    });
    if (notifications.length == 0) return;
    await notificationRepository.remove(notifications);
  }
}
