import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@EventSubscriber()
export class NotificationProfileSubscriber implements EntitySubscriberInterface<ProfileEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ProfileEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile: ProfileEntity | undefined = event.entity;
    const notificationRepository = event.manager.getRepository(NotificationEntity);
    const notifications = await notificationRepository.find({
      relations: ['profile'],
      where: {
        profile: {
          id: softRemovedProfile?.id,
        },
      },
    });
    if (notifications.length == 0) return;
    await notificationRepository.softRemove(notifications).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile: ProfileEntity | undefined = event.entity;
    const notificationRepository: Repository<NotificationEntity> = event.manager.getRepository(NotificationEntity);
    const notifications: NotificationEntity[] = await notificationRepository.find({
      relations: ['profile'],
      withDeleted: true,
      where: {
        profile: {
          id: softRemovedProfile?.id,
        },
      },
    });
    if (notifications.length == 0) return;
    await notificationRepository.remove(notifications).catch(error => {
      console.log(error);
    });
  }
}
