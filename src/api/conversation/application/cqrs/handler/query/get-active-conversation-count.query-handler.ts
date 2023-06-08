import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Between, Repository } from 'typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { GetActiveConversationCountQuery } from '../../query/get-active-conversation-count.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetActiveConversationCountQuery)
export class GetActiveConversationCountQueryHandler implements IQueryHandler<GetActiveConversationCountQuery> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<number> {
    return await this.conversationRepository
      .find({
        relations: ['messages'],
        where: {
          messages: {
            updatedAt: Between(new Date(Date.now() - 3600), new Date(Date.now())),
          },
        },
      })
      .then((conversations: ConversationEntity[]) => {
        return conversations.length;
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetActiveConversationCountQueryHandler',
            localisation: 'conversation.find',
            error: error.message,
          }),
        );
        throw new Error(error.message);
      });
  }
}
