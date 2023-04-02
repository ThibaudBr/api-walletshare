import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { IsCardOwnerWithUserIdQuery } from '../../query/is-card-owner-with-user-id.query';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(IsCardOwnerWithUserIdQuery)
export class IsCardOwnerWithUserIdQueryHandler implements IQueryHandler<IsCardOwnerWithUserIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsCardOwnerWithUserIdQuery): Promise<boolean> {
    try {
      const card = await this.cardRepository
        .findOneOrFail({
          relations: ['owner'],
          where: [
            {
              id: query.cardId,
            },
          ],
        })
        .catch(() => {
          throw new Error('Card not found');
        });

      return card.owner.id === query.userId;
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'IsCardOwnerWithUserIdQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
