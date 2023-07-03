import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
  SoftRemoveEvent,
} from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { CompanyEmployeeEntity } from '../../domain/entities/company-employee.entity';
import { SubscriptionEntity } from '../../../payment/subscription/domain/entities/subscription.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';

@EventSubscriber()
export class CompanyEmployeeProfile implements EntitySubscriberInterface<CompanyEmployeeEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CompanyEmployeeEntity;
  }

  async afterInsert(event: InsertEvent<CompanyEmployeeEntity>): Promise<void> {
    const createdCompanyEmployee: CompanyEmployeeEntity = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const subscriptionRepository: Repository<SubscriptionEntity> = event.manager.getRepository(SubscriptionEntity);

    const companyEmployee: CompanyEmployeeEntity = await companyEmployeeRepository.findOneOrFail({
      relations: ['profile', 'company', 'company.ownerProfile', 'company.ownerProfile.user'],
      where: {
        id: createdCompanyEmployee?.id,
      },
    });

    const subscription: SubscriptionEntity = await subscriptionRepository.findOneOrFail({
      relations: ['user'],
      where: {
        user: {
          id: companyEmployee.company.ownerProfile.user.id,
        },
      },
    });

    subscription.profileEmployeeIds.push(companyEmployee.profile.id);
    await subscriptionRepository.save(subscription).catch(error => {
      console.log(error);
    });
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CompanyEmployeeEntity>): Promise<void> {
    const softRemovedCompanyEmployee: CompanyEmployeeEntity | undefined = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const profileRepository: Repository<ProfileEntity> = event.manager.getRepository(ProfileEntity);
    const subscriptionRepository: Repository<SubscriptionEntity> = event.manager.getRepository(SubscriptionEntity);
    const userRepository: Repository<UserEntity> = event.manager.getRepository(UserEntity);

    const companyEmployee: CompanyEmployeeEntity = await companyEmployeeRepository.findOneOrFail({
      relations: ['profile', 'profile.user', 'company', 'company.ownerProfile', 'company.ownerProfile.user'],
      where: {
        id: softRemovedCompanyEmployee?.id,
      },
    });

    const subscription: SubscriptionEntity = await subscriptionRepository.findOneOrFail({
      relations: ['user'],
      where: {
        user: {
          id: companyEmployee.company.ownerProfile.user.id,
        },
      },
    });
    subscription.profileEmployeeIds = subscription.profileEmployeeIds.filter(id => id !== companyEmployee.profile.id);
    await subscriptionRepository.save(subscription);

    await userRepository.update(companyEmployee.profile.user.id, {
      roles: companyEmployee.profile.user.roles.filter(role => role !== UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT),
    });

    await profileRepository.softRemove(companyEmployee.profile).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<CompanyEmployeeEntity>): Promise<void> {
    const removedCompanyEmployee: CompanyEmployeeEntity | undefined = event.entity;
    const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
      event.manager.getRepository(CompanyEmployeeEntity);
    const profileRepository: Repository<ProfileEntity> = event.manager.getRepository(ProfileEntity);
    const subscriptionRepository: Repository<SubscriptionEntity> = event.manager.getRepository(SubscriptionEntity);
    const userRepository: Repository<UserEntity> = event.manager.getRepository(UserEntity);

    const companyEmployee: CompanyEmployeeEntity = await companyEmployeeRepository.findOneOrFail({
      relations: ['profile', 'profile.user', 'company', 'company.ownerProfile', 'company.ownerProfile.user'],
      withDeleted: true,
      where: {
        id: removedCompanyEmployee?.id,
      },
    });

    const subscription: SubscriptionEntity = await subscriptionRepository.findOneOrFail({
      relations: ['user'],
      where: {
        user: {
          id: companyEmployee.company.ownerProfile.user.id,
        },
      },
      withDeleted: true,
    });
    subscription.profileEmployeeIds = subscription.profileEmployeeIds.filter(id => id !== companyEmployee.profile.id);
    await subscriptionRepository.save(subscription);

    await userRepository.update(companyEmployee.profile.user.id, {
      roles: companyEmployee.profile.user.roles.filter(role => role !== UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT),
    });

    await profileRepository.softRemove(companyEmployee.profile).catch(error => {
      console.log(error);
    });
  }
}
