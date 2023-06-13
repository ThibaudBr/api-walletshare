import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { CompanyEmployeeEntity } from '../../domain/entities/company-employee.entity';

@EventSubscriber()
export class ProfileCompanyEmployeeSubscriber implements EntitySubscriberInterface<ProfileEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ProfileEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile: ProfileEntity | undefined = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const companyEmployees: CompanyEmployeeEntity[] = await companyEmployeeRepository.find({
      relations: ['profile'],
      where: {
        profile: {
          id: softRemovedProfile?.id,
        },
      },
    });
    if (companyEmployees.length == 0) return;
    for (const companyEmployee of companyEmployees) {
      await companyEmployeeRepository.softRemove(companyEmployee);
    }
  }

  async beforeRemove(event: RemoveEvent<ProfileEntity>): Promise<void> {
    const removedProfile: ProfileEntity | undefined = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const companyEmployees: CompanyEmployeeEntity[] = await companyEmployeeRepository.find({
      relations: ['profile'],
      withDeleted: true,
      where: {
        profile: {
          id: removedProfile?.id,
        },
      },
    });
    if (companyEmployees.length == 0) return;
    for (const companyEmployee of companyEmployees) {
      await companyEmployeeRepository.remove(companyEmployee);
    }
  }
}
