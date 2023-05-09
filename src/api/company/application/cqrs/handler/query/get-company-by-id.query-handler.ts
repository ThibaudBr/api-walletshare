import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyByIdQuery } from '../../query/get-company-by-id.query';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetCompanyByIdQuery)
export class GetCompanyByIdQueryHandler implements IQueryHandler<GetCompanyByIdQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyByIdQuery): Promise<CompanyEntity> {
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
        where: {
          id: query.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCompanyByIdQueryHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });
  }
}
