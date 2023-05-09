import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyWithCriteriaQuery } from '../../query/get-company-with-criteria.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyWithCriteriaQuery)
export class GetCompanyWithCriteriaQueryHandler implements IQueryHandler<GetCompanyWithCriteriaQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyWithCriteriaQuery): Promise<CompanyEntity[]> {
    const queryBuilder = this.companyRepository.createQueryBuilder('company');

    queryBuilder.setFindOptions({
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
    });

    if (query.isDeleted) {
      queryBuilder.withDeleted();
    }

    return await queryBuilder.getMany().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'GetCompanyWithCriteriaQueryHandler',
          localisation: 'companyRepository.getMany',
        }),
      );
      throw new Error('Company not found');
    });
  }
}
