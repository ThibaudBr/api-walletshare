import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { CardEntity } from '../../domain/entities/card.entity';

@EventSubscriber()
export class ProfileCardSubscriber implements EntitySubscriberInterface<ProfileEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ProfileEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile = event.entity;
    const cardRepository = event.manager.getRepository(CardEntity);
    const cards = await cardRepository.find({
      relations: ['owner'],
      where: {
        owner: {
          id: softRemovedProfile?.id,
        },
      },
    });
    if (cards.length == 0) return;
    await cardRepository.softRemove(cards).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile = event.entity;
    const cardRepository = event.manager.getRepository(CardEntity);
    const cards = await cardRepository.find({
      relations: ['owner'],
      withDeleted: true,
      where: {
        owner: {
          id: softRemovedProfile?.id,
        },
      },
    });
    if (cards.length == 0) return;
    await cardRepository.remove(cards).catch(error => {
      console.log(error);
    });
  }
}
