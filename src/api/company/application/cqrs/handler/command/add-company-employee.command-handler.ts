import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { AddCompanyEmployeeCommand } from '../../command/add-company-employee.command';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddCompanyEmployeeEvent } from '../../event/add-company-employee.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(AddCompanyEmployeeCommand)
export class AddCompanyEmployeeCommandHandler implements ICommandHandler<AddCompanyEmployeeCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeEntityRepository: Repository<CompanyEmployeeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddCompanyEmployeeCommand): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        relations: ['members', 'members.profile'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'AddCompanyEmployeeCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'AddCompanyEmployeeCommandHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    if (company.employees.find(employee => employee.profile.id == command.profileId)) {
      throw new Error('Profile already in company');
    }

    await this.companyEmployeeEntityRepository
      .save({
        company: company,
        profile: profile,
        roles: command.roles,
      })
      .then(async companyEmployee => {
        this.eventBus.publish(
          new AddCompanyEmployeeEvent({
            companyId: companyEmployee.company.id,
            profileId: companyEmployee.profile.id,
            roles: companyEmployee.roles,
          }),
        );
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'AddCompanyEmployeeCommandHandler',
            localisation: 'companyEmployeeEntityRepository.save',
          }),
        );
        throw new Error('Error while saving company employee');
      });
  }
}
