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
          'ownerProfile.user',
          'ownerProfile.personalCards',
          'ownerProfile.personalCards.socialNetwork',
          'ownerProfile.personalCards.occupations',
          'ownerProfile.savedCard.owner',
          'ownerProfile.savedCard.owner.user',
          'ownerProfile.savedCard.socialNetwork',
          'ownerProfile.savedCard.occupations',
          'ownerProfile.occupations',
          'ownerProfile.avatarMedia',
          'ownerProfile.bannerMedia',
          'addresses',
          'avatarMedia',
          'bannerMedia',
          'employees',
          'employees.profile',
          'employees.profile.user',
          'employees.profile.personalCards',
          'employees.profile.personalCards.socialNetwork',
          'employees.profile.personalCards.occupations',
          'employees.profile.savedCard.owner',
          'employees.profile.savedCard.owner.user',
          'employees.profile.savedCard.socialNetwork',
          'employees.profile.savedCard.occupations',
          'employees.profile.occupations',
          'employees.profile.avatarMedia',
          'employees.profile.bannerMedia',
          'cardPresets',
          'cardPresets.cards',
          'cardPresets.cards.owner',
          'cardPresets.cards.socialNetwork',
          'cardPresets.cards.occupations',
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
