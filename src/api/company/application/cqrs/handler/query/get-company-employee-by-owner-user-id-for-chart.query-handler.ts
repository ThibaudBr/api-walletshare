import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyEmployeeByOwnerUserIdForChartQuery } from '../../query/get-company-employee-by-owner-user-id-for-chart.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyEmployeeByOwnerUserIdForChartQuery)
export class GetCompanyEmployeeByOwnerUserIdForChartQueryHandler
  implements IQueryHandler<GetCompanyEmployeeByOwnerUserIdForChartQuery>
{
  constructor(
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeRepository: Repository<CompanyEmployeeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyEmployeeByOwnerUserIdForChartQuery): Promise<CompanyEmployeeEntity[]> {
    return await this.companyEmployeeRepository
      .find({
        relations: [
          'company',
          'company.ownerProfile',
          'company.ownerProfile.user',
          'profile',
          'profile.user',
          'profile.personalCards',
          'profile.personalCards.cardViews',
          'profile.personalCards.connectedCardOne',
          'profile.personalCards.connectedCardTwo',
        ],
        where: {
          company: {
            ownerProfile: {
              user: {
                id: query.userId,
              },
            },
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCompanyEmployeeWithOwnerUserIdQueryHandler',
            localisation: 'companyEmployeeRepository.find',
          }),
        );
        throw new Error('Company employee not found');
      });
  }
}
