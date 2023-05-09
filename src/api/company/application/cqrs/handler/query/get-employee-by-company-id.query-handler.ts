import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEmployeeByCompanyIdQuery } from '../../query/get-employee-by-company-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetEmployeeByCompanyIdQuery)
export class GetEmployeeByCompanyIdQueryHandler implements IQueryHandler<GetEmployeeByCompanyIdQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetEmployeeByCompanyIdQuery): Promise<CompanyEmployeeEntity[]> {
    return await this.companyRepository
      .findOneOrFail({
        relations: ['employees', 'employees.profile', 'employees.profile.personalCards'],
        where: {
          id: query.companyId,
        },
      })
      .then(company => {
        return company.employees;
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetEmployeeByCompanyIdQueryHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });
  }
}
