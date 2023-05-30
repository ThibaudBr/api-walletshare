import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardByIdForConversationQuery } from '../../query/get-card-by-id-for-conversation.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCardByIdForConversationQuery)
export class GetCardByIdForConversationQueryHandler implements IQueryHandler<GetCardByIdForConversationQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardByIdForConversationQuery): Promise<CardEntity> {
    return await this.cardRepository
      .findOneOrFail({
        relations: ['owner', 'owner.user'],
        where: {
          id: query.cardId,
        },
      })
      .catch(async err => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetCardByIdForConversationQueryHandler',
            localisation: 'conversation',
            error: err,
          }),
        );
        throw new Error('An error occurred while getting card by id for conversation');
      });
  }
}
