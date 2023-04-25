import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { ProfileEntity } from '../domain/entities/profile.entity';

@EventSubscriber()
export class ProfileSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    try {
      const softRemovedUser = event.entity;
      const profileRepository = event.manager.getRepository(ProfileEntity);
      await profileRepository.update(
        {
          user: {
            id: softRemovedUser?.id,
          },
        },
        { deletedAt: new Date() },
      );
    } catch (e) {
      throw e;
    }
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    try {
      const softRemovedUser = event.entity;
      const profileRepository = event.manager.getRepository(ProfileEntity);
      await profileRepository.delete({
        user: {
          id: softRemovedUser?.id,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
