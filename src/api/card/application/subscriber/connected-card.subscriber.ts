import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { CardEntity } from '../../domain/entities/card.entity';
import { ConnectedCardEntity } from '../../domain/entities/connected-card.entity';

@EventSubscriber()
export class ConnectedCardSubscriber implements EntitySubscriberInterface<CardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const connectedCardRepository: Repository<ConnectedCardEntity> = event.manager.getRepository(ConnectedCardEntity);
    const connectedCards: ConnectedCardEntity[] = await connectedCardRepository.find({
      relations: ['cardEntityOne', 'cardEntityTwo'],
      where: [
        {
          cardEntityOne: {
            id: softRemovedCard?.id,
          },
        },
        {
          cardEntityTwo: {
            id: softRemovedCard?.id,
          },
        },
      ],
    });
    if (connectedCards.length == 0) return;
    await connectedCardRepository.softRemove(connectedCards).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const connectedCardRepository: Repository<ConnectedCardEntity> = event.manager.getRepository(ConnectedCardEntity);
    const connectedCards: ConnectedCardEntity[] = await connectedCardRepository.find({
      relations: ['cardEntityOne', 'cardEntityTwo'],
      withDeleted: true,
      where: [
        {
          cardEntityOne: {
            id: softRemovedCard?.id,
          },
        },
        {
          cardEntityTwo: {
            id: softRemovedCard?.id,
          },
        },
      ],
    });
    if (connectedCards.length == 0) return;
    await connectedCardRepository.remove(connectedCards).catch(error => {
      console.log(error);
    });
  }
}
