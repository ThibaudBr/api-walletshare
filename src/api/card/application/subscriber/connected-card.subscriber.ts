import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { CardEntity } from '../../domain/entities/card.entity';
import { ConnectedCardEntity } from '../../domain/entities/connected-card.entity';

@EventSubscriber()
export class ConnectedCardSubscriber implements EntitySubscriberInterface<CardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard = event.entity;
    const connectedCardRepository = event.manager.getRepository(ConnectedCardEntity);
    await connectedCardRepository.update(
      {
        cardEntityOne: {
          id: softRemovedCard?.id,
        },
      },
      {
        deletedAt: new Date(),
      },
    );
    await connectedCardRepository.update(
      {
        cardEntityTwo: {
          id: softRemovedCard?.id,
        },
      },
      {
        deletedAt: new Date(),
      },
    );
  }

  async beforeRemove(event: RemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard = event.entity;
    const connectedCardRepository = event.manager.getRepository(ConnectedCardEntity);
    await connectedCardRepository.delete({
      cardEntityTwo: {
        id: softRemovedCard?.id,
      },
    });
    await connectedCardRepository.delete({
      cardEntityOne: {
        id: softRemovedCard?.id,
      },
    });
  }
}
