import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardPresetByCompanyIdQuery } from '../../query/get-card-preset-by-company-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCardPresetByCompanyIdQuery)
export class GetCardPresetByCompanyIdQueryHandler implements IQueryHandler<GetCardPresetByCompanyIdQuery> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardPresetByCompanyIdQuery): Promise<CardPresetEntity[]> {
    return await this.cardPresetRepository
      .find({
        relations: ['company', 'cards', 'cards.owner', 'cards.socialNetwork', 'cards.occupations', 'media'],
        where: {
          company: {
            id: query.companyId,
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCardPresetByCompanyIdQueryHandler',
            localisation: 'cardPresetRepository.find',
          }),
        );
        throw new Error('Company preset not found');
      });
  }
}
