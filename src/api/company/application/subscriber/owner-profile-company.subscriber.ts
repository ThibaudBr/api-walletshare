import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { CompanyEntity } from '../../domain/entities/company.entity';

@EventSubscriber()
export class OwnerProfileCompanySubscriber implements EntitySubscriberInterface<ProfileEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ProfileEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile: ProfileEntity | undefined = event.entity;
    const companyRepository: Repository<CompanyEntity> = event.manager.getRepository(CompanyEntity);
    const companyEntities: CompanyEntity[] = await companyRepository.find({
      relations: ['ownerProfile'],
      where: {
        ownerProfile: {
          id: softRemovedProfile?.id,
        },
      },
    });
    if (companyEntities.length == 0) return;
    for (const company of companyEntities) {
      await companyRepository.softRemove(company);
    }
  }

  async beforeRemove(event: RemoveEvent<ProfileEntity>): Promise<void> {
    const removedProfile: ProfileEntity | undefined = event.entity;
    const companyRepository: Repository<CompanyEntity> = event.manager.getRepository(CompanyEntity);
    const companyEntities: CompanyEntity[] = await companyRepository.find({
      relations: ['ownerProfile'],
      withDeleted: true,
      where: {
        ownerProfile: {
          id: removedProfile?.id,
        },
      },
    });
    if (companyEntities.length == 0) return;
    for (const company of companyEntities) {
      await companyRepository.remove(company);
    }
  }
}
