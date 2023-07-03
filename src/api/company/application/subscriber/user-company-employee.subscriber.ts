import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { CompanyEmployeeEntity } from '../../domain/entities/company-employee.entity';

@EventSubscriber()
export class UserCompanyEmployeeSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const removedUser: UserEntity | undefined = event.entity;
    const companyEmployeeRepository = event.manager.getRepository(CompanyEmployeeEntity);
    const companyEmployees: CompanyEmployeeEntity[] = await companyEmployeeRepository.find({
      relations: ['profile', 'profile.user'],
      withDeleted: true,
      where: {
        profile: {
          user: {
            id: removedUser?.id,
          },
        },
      },
    });
    if (companyEmployees.length == 0) return;
    for (const companyEmployee of companyEmployees) {
      await companyEmployeeRepository.remove(companyEmployee).catch(error => {
        console.log(error);
      });
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const companyEmployeeRepository = event.manager.getRepository(CompanyEmployeeEntity);
    const companyEmployees: CompanyEmployeeEntity[] = await companyEmployeeRepository.find({
      relations: ['profile', 'profile.user'],
      where: {
        profile: {
          user: {
            id: softRemovedUser?.id,
          },
        },
      },
    });
    if (companyEmployees.length == 0) return;
    for (const companyEmployee of companyEmployees) {
      await companyEmployeeRepository.softRemove(companyEmployee).catch(error => {
        console.log(error);
      });
    }
  }
}
