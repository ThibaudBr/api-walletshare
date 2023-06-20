import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { GetCompanyPresetByOwnerUserIdQuery } from '../../query/get-company-preset-by-owner-user-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCompanyPresetByOwnerUserIdQuery)
export class GetCompanyPresetByOwnerUserIdQueryHandler implements IQueryHandler<GetCompanyPresetByOwnerUserIdQuery> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCompanyPresetByOwnerUserIdQuery): Promise<CardPresetEntity[]> {
    return await this.cardPresetRepository
      .find({
        relations: [
          'company',
          'company.ownerProfile',
          'company.ownerProfile.user',
          'cards',
          'cards.owner',
          'cards.socialNetwork',
          'cards.occupations',
          'media',
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
            handler: 'GetCompanyPresetByOwnerUserIdQueryHandler',
            localisation: 'cardPresetRepository.find',
          }),
        );
        throw new Error('Company preset not found');
      });
  }
}
