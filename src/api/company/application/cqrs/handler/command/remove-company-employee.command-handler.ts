import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCompanyEmployeeCommand } from '../../command/remove-company-employee.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveCompanyEmployeeCommand)
export class RemoveCompanyEmployeeCommandHandler implements ICommandHandler<RemoveCompanyEmployeeCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeEntityRepository: Repository<CompanyEmployeeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveCompanyEmployeeCommand): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        relations: ['employees', 'employees.profile', 'employees.profile.user'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RemoveCompanyEmployeeCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    const employee: CompanyEmployeeEntity | undefined = company.employees.find(employee => employee.profile.user.id);

    if (employee) {
      await this.companyEmployeeEntityRepository.softRemove(employee);
      await this.eventBus.publish(
        new RemoveCompanyEmployeeCommand({
          companyId: command.companyId,
          profileId: command.profileId,
        }),
      );
    } else {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: 'Employee not found',
          handler: 'RemoveCompanyEmployeeCommandHandler',
          localisation: 'company.employees.find',
        }),
      );
      throw new Error('Employee not found');
    }
  }
}
