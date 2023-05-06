import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { IsCardOwnerWithUserIdQuery } from '../../query/is-card-owner-with-user-id.query';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(IsCardOwnerWithUserIdQuery)
export class IsCardOwnerWithUserIdQueryHandler implements IQueryHandler<IsCardOwnerWithUserIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsCardOwnerWithUserIdQuery): Promise<boolean> {
    const card = await this.cardRepository
      .findOneOrFail({
        relations: ['owner', 'owner.user'],
        where: {
          id: query.cardId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'IsCardOwnerWithUserIdQueryHandler',
            localisation: 'cardRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Card not found');
      });

    return card.owner.user.id === query.userId;
  }
}
