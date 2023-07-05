import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
  SoftRemoveEvent,
} from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { ProfileEntity } from '../../domain/entities/profile.entity';
import { RoleProfileEnum } from '../../domain/enum/role-profile.enum';
import { CompanyEmployeeEntity } from '../../../company/domain/entities/company-employee.entity';

@EventSubscriber()
export class ProfileSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async afterInsert(event: InsertEvent<UserEntity>): Promise<void> {
    const user: UserEntity = event.entity;
    const profileRepository: Repository<ProfileEntity> = event.manager.getRepository(ProfileEntity);
    const newProfile: ProfileEntity = profileRepository.create({
      user: user,
      roleProfile: RoleProfileEnum.CLASSIC,
      usernameProfile: user.username ?? 'UpdateYourUsername',
    });
    await profileRepository.save(newProfile).catch(error => {
      console.log(error);
    });
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const profileRepository: Repository<ProfileEntity> = event.manager.getRepository(ProfileEntity);
    let profiles: ProfileEntity[] = await profileRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (profiles.length == 0) return;

    for (const profile of profiles) {
      if (profile.roleProfile == RoleProfileEnum.COMPANY) {
        const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
          event.manager.getRepository(CompanyEmployeeEntity);
        const companyEmployee: CompanyEmployeeEntity = await companyEmployeeRepository
          .findOneOrFail({
            relations: ['profile', 'profile.user'],
            where: {
              profile: {
                id: profile.id,
              },
            },
          })
          .catch(error => {
            console.log(error);
            throw error;
          });
        profiles = profiles.filter(profile => profile.id != companyEmployee.profile.id);
        await companyEmployeeRepository.softRemove(companyEmployee).catch(error => {
          console.log(error);
        });
      }
    }
    await profileRepository.softRemove(profiles).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const profileRepository: Repository<ProfileEntity> = event.manager.getRepository(ProfileEntity);
    let profiles: ProfileEntity[] = await profileRepository.find({
      relations: ['user'],
      withDeleted: true,
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (profiles.length == 0) return;

    for (const profile of profiles) {
      if (profile.roleProfile == RoleProfileEnum.COMPANY) {
        const companyEmployeeRepository: Repository<CompanyEmployeeEntity> =
          event.manager.getRepository(CompanyEmployeeEntity);
        const companyEmployee: CompanyEmployeeEntity = await companyEmployeeRepository
          .findOneOrFail({
            relations: ['profile', 'profile.user'],
            withDeleted: true,
            where: {
              profile: {
                id: profile.id,
              },
            },
          })
          .catch(error => {
            console.log(error);
            throw error;
          });
        profiles = profiles.filter(profile => profile.id != companyEmployee.profile.id);
        await companyEmployeeRepository.remove(companyEmployee).catch(error => {
          console.log(error);
        });
      }
    }
    await profileRepository.remove(profiles).catch(error => {
      console.log(error);
    });
  }
}
