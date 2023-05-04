import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { AddressEntity } from '../../domain/entities/address.entity';

@EventSubscriber()
export class UserAddressSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const addressRepository: Repository<AddressEntity> = event.manager.getRepository(AddressEntity);
    const addresses: AddressEntity[] = await addressRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (addresses.length == 0) return;
    await addressRepository.softRemove(addresses);
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const removedUser: UserEntity | undefined = event.entity;
    const addressRepository: Repository<AddressEntity> = event.manager.getRepository(AddressEntity);
    const addresses: AddressEntity[] = await addressRepository.find({
      relations: ['user'],
      withDeleted: true,
      where: {
        user: {
          id: removedUser?.id,
        },
      },
    });
    if (addresses.length == 0) return;
    await addressRepository.remove(addresses);
  }
}
