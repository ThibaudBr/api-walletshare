import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../../domain/entities/company-employee.entity';

@EventSubscriber()
export class CompanyCompanyEmployeeSubscriber implements EntitySubscriberInterface<CompanyEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CompanyEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CompanyEntity>): Promise<void> {
    const softRemovedCompany: CompanyEntity | undefined = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const companyEmployees: CompanyEmployeeEntity[] = await companyEmployeeRepository.find({
      relations: ['company'],
      where: {
        company: {
          id: softRemovedCompany?.id,
        },
      },
    });
    if (companyEmployees.length == 0) return;
    for (const companyEmployee of companyEmployees) {
      await companyEmployeeRepository.softRemove(companyEmployee);
    }
  }

  async beforeRemove(event: RemoveEvent<CompanyEntity>): Promise<void> {
    const removedCompany: CompanyEntity | undefined = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const companyEmployees: CompanyEmployeeEntity[] = await companyEmployeeRepository.find({
      relations: ['company'],
      withDeleted: true,
      where: {
        company: {
          id: removedCompany?.id,
        },
      },
    });
    if (companyEmployees.length == 0) return;
    for (const companyEmployee of companyEmployees) {
      await companyEmployeeRepository.remove(companyEmployee);
    }
  }
}
