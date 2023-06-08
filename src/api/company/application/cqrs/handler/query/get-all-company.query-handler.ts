import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCompanyQuery } from '../../query/get-all-company.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllCompanyQuery)
export class GetAllCompanyQueryHandler implements IQueryHandler<GetAllCompanyQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query:GetAllCompanyQuery): Promise<CompanyEntity[]> {
    try {
      return await this.companyRepository.find({
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
        withDeleted: query.deleted,
        take: query.take == -1 ? undefined : query.take,
        skip: query.skip == -1 ? undefined : query.skip,
      });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'companyRepository.find',
          handler: 'GetAllCompanyQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
