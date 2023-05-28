import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateConversationMessageCommand } from '../../command/create-conversation-message.command';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { CreateConversationMessageEvent } from '../../event/create-conversation-message.event';

@CommandHandler(CreateConversationMessageCommand)
export class CreateConversationMessageCommandHandler implements ICommandHandler<CreateConversationMessageCommand> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateConversationMessageCommand): Promise<void> {
    const conversation: ConversationEntity = await this.conversationRepository
      .findOneOrFail({
        where: {
          id: command.conversationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateConversationMessageCommandHandler',
            localisation: 'ConversationEntity.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Conversation not found');
      });
    const card: CardEntity = await this.cardRepository
      .findOneOrFail({
        where: {
          id: command.cardId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateConversationMessageCommandHandler',
            localisation: 'CardEntity.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Card not found');
      });

    const newMessage: MessageEntity = new MessageEntity({
      content: command.content,
      conversation: conversation,
      author: card,
    });
    await this.messageRepository
      .save(newMessage)
      .then(async (messageEntity: MessageEntity) => {
        await this.eventBus.publish(
          new CreateConversationMessageEvent({
            conversationId: command.conversationId,
            cardId: command.cardId,
            messageId: messageEntity.id,
          }),
        );
        return messageEntity;
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateConversationMessageCommandHandler',
            localisation: 'MessageRepository.save',
            error: error,
          }),
        );
        throw new Error('Message not saved');
      });
  }
}
