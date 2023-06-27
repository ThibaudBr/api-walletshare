import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyEmployeeByOwnerUserIdQuery } from '../../query/get-company-employee-by-owner-user-id.query';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyEmployeeByOwnerUserIdQuery)
export class GetCompanyEmployeeByOwnerUserIdQueryHandler
  implements IQueryHandler<GetCompanyEmployeeByOwnerUserIdQuery>
{
  constructor(
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeRepository: Repository<CompanyEmployeeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyEmployeeByOwnerUserIdQuery): Promise<CompanyEmployeeEntity[]> {
    return await this.companyEmployeeRepository
      .find({
        relations: [
          'company',
          'company.ownerProfile',
          'company.ownerProfile.user',
          'profile',
          'profile.user',
          'profile.personalCards',
          'profile.personalCards.socialNetwork',
          'profile.personalCards.occupations',
          'profile.personalCards.cardViews',
          'profile.savedCard.owner',
          'profile.savedCard.owner.user',
          'profile.savedCard.socialNetwork',
          'profile.savedCard.occupations',
          'profile.occupations',
          'profile.avatarMedia',
          'profile.bannerMedia',
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
