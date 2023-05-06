import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardByIdQuery } from '../../query/get-card-by-id.query';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCardByIdQuery)
export class GetCardByIdQueryHandler implements IQueryHandler<GetCardByIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardByIdQuery): Promise<CardEntity> {
    return await this.cardRepository
      .findOneOrFail({
        relations: ['occupations', 'owner', 'socialNetwork', 'owner.user'],
        where: [
          {
            id: query.id,
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetCardByIdQueryHandler',
            localisation: 'cardRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw error;
      });
  }
}
