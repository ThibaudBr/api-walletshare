import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GiveRightToEmployeeCommand } from '../../command/give-right-to-employee.command';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyEntity from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(GiveRightToEmployeeCommand)
export class GiveRightToEmployeeCommandHandler implements ICommandHandler<GiveRightToEmployeeCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeEntityRepository: Repository<CompanyEmployeeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: GiveRightToEmployeeCommand): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        relations: ['employees', 'employees.profile'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GiveRightToEmployeeCommandHandler',
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
            handler: 'GiveRightToEmployeeCommandHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    const employee: CompanyEmployeeEntity | undefined = company.employees.find(
      employee => employee.profile.id == profile.id,
    );

    if (!employee) throw new Error('User is not an employee of this company');

    employee.roles = command.roles;

    await this.companyEmployeeEntityRepository.save(employee).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'GiveRightToEmployeeCommandHandler',
          localisation: 'companyEmployeeEntityRepository.save',
        }),
      );
      throw new Error('Error while saving employee');
    });
  }
}
