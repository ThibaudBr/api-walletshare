import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardByIdQuery } from '../../query/get-card-by-id.query';
import { Repository } from 'typeorm';
import { CardDto } from '../../../domain/dto/card.dto';
import { CardEntity } from '../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { CardResponse } from "../../../web/response/card.response";

@QueryHandler(GetCardByIdQuery)
export class GetCardByIdQueryHandler implements IQueryHandler<GetCardByIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardByIdQuery): Promise<CardEntity> {
    try {
      return await this.cardRepository
        .findOneOrFail({
          relations: ['occupation', 'owner', 'socialNetwork'],
          where: [
            {
              id: query.id,
            },
          ],
        })
        .catch(() => {
          throw new Error('Card not found');
        });

    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetCardByIdQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
