import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllConversationQuery } from '../../query/get-all-conversation.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllConversationQuery)
export class GetAllConversationQueryHandler implements IQueryHandler<GetAllConversationQuery> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllConversationQuery): Promise<ConversationEntity[]> {
    return await this.conversationRepository.find({relations:['joinedprofiles']} ).catch(async err => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'GetAllConversationQueryHandler',
          localisation: 'conversation',
          error: err,
        }),
      );
      throw new Error('An error occurred while getting all conversation');
    });
  }
}
