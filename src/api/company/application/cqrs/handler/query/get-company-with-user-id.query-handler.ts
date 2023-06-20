import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyWithUserIdQuery } from '../../query/get-company-with-user-id.query';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyWithUserIdQuery)
export class GetCompanyWithUserIdQueryHandler implements IQueryHandler<GetCompanyWithUserIdQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyWithUserIdQuery): Promise<CompanyEntity[]> {
    return await this.companyRepository
      .find({
        relations: [
          'occupations',
          'ownerProfile',
          'ownerProfile.user',
          'addresses',
          'avatarMedia',
          'bannerMedia',
          'employees',
          'employees.profile',
          'employees.profile.personalCards',
          'employees.profile.user',
        ],
        where: [
          {
            ownerProfile: {
              user: {
                id: query.userId,
              },
            },
          },
          {
            employees: {
              profile: {
                user: {
                  id: query.userId,
                },
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
            localisation: 'companyRepository.find',
          }),
        );
        throw new Error('Company not found');
      });
  }
}
