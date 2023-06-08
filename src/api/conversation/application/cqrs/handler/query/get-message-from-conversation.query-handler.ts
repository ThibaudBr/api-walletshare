import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessageFromConversationQuery } from '../../query/get-message-from-conversation.query';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetMessageFromConversationQuery)
export class GetMessageFromConversationQueryHandler implements IQueryHandler<GetMessageFromConversationQuery> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetMessageFromConversationQuery): Promise<ConversationEntity> {
    const conversation: ConversationEntity = await this.conversationRepository
      .findOneOrFail({
        where: {
          id: query.conversationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetMessageFromConversationQueryHandler',
            localisation: 'ConversationRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Conversation not found');
      });

    conversation.messages = await this.messageRepository
      .find({
        relations: ['author', 'author.owner', 'author.owner.user'],
        order: {
          createdAt: 'DESC',
        },
        take: query.nbMessage,
        skip: query.skip ?? 0,
        where: {
          conversation: {
            id: conversation.id,
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetMessageFromConversationQueryHandler',
            localisation: 'MessageRepository.find',
            error: error,
          }),
        );
        throw new Error('Messages not found');
      });
    return conversation;
  }
}
