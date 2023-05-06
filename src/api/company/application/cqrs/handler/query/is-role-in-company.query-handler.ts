import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsRoleInCompanyQuery } from '../../query/is-role-in-company.query';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyEntity from '../../../../domain/entities/company.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';

@QueryHandler(IsRoleInCompanyQuery)
export class IsRoleInCompanyQueryHandler implements IQueryHandler<IsRoleInCompanyQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsRoleInCompanyQuery): Promise<boolean> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: query.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'IsRoleInCompanyQueryHandler',
            localisation: 'userRepository.findOneOrFail',
          }),
        );
        throw new Error('User not found');
      });

    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        relations: ['employees', 'employees.profile', 'employees.profile.user'],
        where: {
          id: query.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'IsRoleInCompanyQueryHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    const companyEmployee: CompanyEmployeeEntity | undefined = company.employees.find(
      employee => employee.profile.user.id === user.id,
    );

    if (!companyEmployee) {
      return false;
    }

    let shouldReturn = false;
    companyEmployee?.roles.forEach(role => {
      if (query.roles.includes(role)) {
        shouldReturn = true;
      }
    });
    return shouldReturn;
  }
}
