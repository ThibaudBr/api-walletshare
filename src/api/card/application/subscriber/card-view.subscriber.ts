import { EntitySubscriberInterface, EventSubscriber, Repository, SoftRemoveEvent } from 'typeorm';
import { CardEntity } from '../../domain/entities/card.entity';
import { CardViewEntity } from '../../domain/entities/card-view.entity';

@EventSubscriber()
export class CardViewSubscriber implements EntitySubscriberInterface<CardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const cardViewRepository: Repository<CardViewEntity> = event.manager.getRepository(CardViewEntity);
    const cardViews: CardViewEntity[] = await cardViewRepository.find({
      relations: ['card'],
      where: {
        card: {
          id: softRemovedCard?.id,
        },
      },
    });
    if (cardViews.length == 0) return;
    await cardViewRepository.softRemove(cardViews)
      .catch(error => {
        console.log(error);
      });
  }

  async beforeRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const cardViewRepository: Repository<CardViewEntity> = event.manager.getRepository(CardViewEntity);
    const cardViews: CardViewEntity[] = await cardViewRepository.find({
      relations: ['card'],
      withDeleted: true,
      where: {
        card: {
          id: softRemovedCard?.id,
        },
      },
    });
    if (cardViews.length == 0) return;
    await cardViewRepository.remove(cardViews)
      .catch(error => {
        console.log(error);
      });
  }
}
