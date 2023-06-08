import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { GetCardPresetByIdQuery } from '../../query/get-card-preset-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCardPresetByIdQuery)
export class GetCardPresetByIdQueryHandler implements IQueryHandler<GetCardPresetByIdQuery> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardPresetByIdQuery): Promise<CardPresetEntity> {
    return await this.cardPresetRepository
      .findOneOrFail({
        relations: ['company', 'media'],
        where: {
          id: query.id,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetCardPresetByIdQueryHandler',
            localisation: 'cardPresetRepository.findOneOrFail',
          }),
        );
        throw new Error('Card preset not found');
      });
  }
}
