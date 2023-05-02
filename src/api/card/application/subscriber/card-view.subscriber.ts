import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from 'typeorm';
import { CardEntity } from '../../domain/entities/card.entity';
import { CardViewEntity } from '../../domain/entities/card-view.entity';

@EventSubscriber()
export class CardViewSubscriber implements EntitySubscriberInterface<CardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard = event.entity;
    const cardViewRepository = event.manager.getRepository(CardViewEntity);
    await cardViewRepository.update(
      {
        card: {
          id: softRemovedCard?.id,
        },
      },
      {
        deletedAt: new Date(),
      },
    );
  }

  async beforeRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard = event.entity;
    const cardViewRepository = event.manager.getRepository(CardViewEntity);
    await cardViewRepository.delete({
      card: {
        id: softRemovedCard?.id,
      },
    });
  }
}
