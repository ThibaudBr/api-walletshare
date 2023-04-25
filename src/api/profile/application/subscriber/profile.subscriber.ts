import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { ProfileEntity } from '../../domain/entities/profile.entity';
import { EventBus } from '@nestjs/cqrs';
import { SoftDeleteProfileEvent } from '../cqrs/event/soft-delete-profile.event';
import { DeleteProfileEvent } from "../cqrs/event/delete-profile.event";

@EventSubscriber()
export class ProfileSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser = event.entity;
    const profileRepository = event.manager.getRepository(ProfileEntity);
    const profiles = await profileRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (profiles.length == 0) return;
    await profileRepository.softRemove(profiles);
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser = event.entity;
    const profileRepository = event.manager.getRepository(ProfileEntity);
    const profiles = await profileRepository.find({
      relations: ['user'],
      withDeleted: true,
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (profiles.length == 0) return;
    await profileRepository.remove(profiles);
  }
}
