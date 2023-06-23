import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { CardPresetEntity } from '../../../company/domain/entities/card-preset.entity';
import { CardEntity } from '../../domain/entities/card.entity';

@EventSubscriber()
export class CardPresetCardSubscriber implements EntitySubscriberInterface<CardPresetEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardPresetEntity;
  }

  async beforeRemove(event: RemoveEvent<CardPresetEntity>): Promise<void> {
    const removedCardPreset: CardPresetEntity | undefined = event.entity;
    const cardRepository: Repository<CardEntity> = event.manager.getRepository(CardEntity);
    const cards: CardEntity[] = await cardRepository.find({
      relations: {
        preset: true,
      },
      withDeleted: true,
      where: {
        preset: {
          id: removedCardPreset?.id,
        },
      },
    });
    if (cards.length == 0) return;
    for (const card of cards) {
      card.preset = undefined;
      await cardRepository.save(card)
        .catch(error => {
          console.log(error);
        });
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardPresetEntity>): Promise<void> {
    const softRemovedCardPreset: CardPresetEntity | undefined = event.entity;
    const cardRepository: Repository<CardEntity> = event.manager.getRepository(CardEntity);
    const cards: CardEntity[] = await cardRepository.find({
      relations: {
        preset: true,
      },
      where: {
        preset: {
          id: softRemovedCardPreset?.id,
        },
      },
    });
    if (cards.length == 0) return;
    for (const card of cards) {
      card.preset = undefined;
      await cardRepository.save(card).catch(error => {
        console.log(error);
      });
    }
  }
}
