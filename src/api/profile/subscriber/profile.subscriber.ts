import {
  EntitySubscriberInterface,
  EventSubscriber,
  Repository,
  SoftRemoveEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { ProfileEntity } from '../domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventBus } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../util/exception/error-handler/error-custom.event';

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
