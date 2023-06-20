import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyByOwnerUserIdQuery } from '../../query/get-company-by-owner-user-id.query';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyByOwnerUserIdQuery)
export class GetCompanyByOwnerUserIdQueryHandler implements IQueryHandler<GetCompanyByOwnerUserIdQuery> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyByOwnerUserIdQuery): Promise<CompanyEntity> {
    return await this.companyRepository
      .findOneOrFail({
        relations: [
          'occupations',
          'ownerProfile',
          'addresses',
          'avatarMedia',
          'bannerMedia',
          'cardPresets',
          'cardPresets.media',
        ],
        where: {
          ownerProfile: {
            user: {
              id: query.userId,
            },
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCompanyByOwnerUserIdQueryHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });
  }
}
