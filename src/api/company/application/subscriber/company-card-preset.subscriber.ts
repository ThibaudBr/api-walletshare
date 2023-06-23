import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CardPresetEntity } from '../../domain/entities/card-preset.entity';

@EventSubscriber()
export class CompanyCardPresetSubscriber implements EntitySubscriberInterface<CompanyEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CompanyEntity;
  }

  async beforeRemove(event: RemoveEvent<CompanyEntity>): Promise<void> {
    const removedCompany: CompanyEntity | undefined = event.entity;
    const cardPresetRepository: Repository<CardPresetEntity> = event.manager.getRepository(CardPresetEntity);
    const cardPresets: CardPresetEntity[] = await cardPresetRepository.find({
      relations: ['company'],
      withDeleted: true,
      where: {
        company: {
          id: removedCompany?.id,
        },
      },
    });
    if (cardPresets.length == 0) return;
    for (const cardPreset of cardPresets) {
      await cardPresetRepository.remove(cardPreset)
        .catch(error => {
          console.log(error);
        });
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CompanyEntity>): Promise<void> {
    const softRemovedCompany: CompanyEntity | undefined = event.entity;
    const cardPresetRepository: Repository<CardPresetEntity> = event.manager.getRepository(CardPresetEntity);
    const cardPresets: CardPresetEntity[] = await cardPresetRepository.find({
      relations: ['company'],
      where: {
        company: {
          id: softRemovedCompany?.id,
        },
      },
    });
    if (cardPresets.length == 0) return;
    for (const cardPreset of cardPresets) {
      await cardPresetRepository.softRemove(cardPreset)
        .catch(error => {
          console.log(error);
        });
    }
  }
}
