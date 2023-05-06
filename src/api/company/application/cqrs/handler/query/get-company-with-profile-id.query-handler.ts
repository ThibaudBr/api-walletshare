import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyWithProfileIdQuery } from '../../query/get-company-with-profile-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyEntity from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyWithProfileIdQuery)
export class GetCompanyWithProfileIdQueryHandler implements IQueryHandler<GetCompanyWithProfileIdQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyWithProfileIdQuery): Promise<CompanyEntity> {
    return await this.companyRepository
      .findOneOrFail({
        relations: [
          'occupations',
          'ownerProfile',
          'ownerProfile.user',
          'addresses',
          'profilePicture',
          'bannerPicture',
          'employees',
          'employees.profile',
          'employees.profile.personalCards',
        ],
        where: [
          {
            ownerProfile: {
              id: query.profileId,
            },
          },
          {
            employees: {
              profile: {
                id: query.profileId,
              },
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCompanyWithProfileIdQueryHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });
  }
}
