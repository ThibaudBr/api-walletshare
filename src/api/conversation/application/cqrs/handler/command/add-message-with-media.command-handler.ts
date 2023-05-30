import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddMessageWithMediaCommand } from '../../command/add-message-with-media.command';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { AddMessageWithMediaEvent } from '../../event/add-message-with-media.event';

@CommandHandler(AddMessageWithMediaCommand)
export class AddMessageWithMediaCommandHandler implements ICommandHandler<AddMessageWithMediaCommand> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddMessageWithMediaCommand): Promise<MessageEntity> {
    const conversation: ConversationEntity = await this.conversationRepository
      .findOneOrFail({
        loadEagerRelations: false,
        where: {
          id: command.conversationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddMessageWithMediaCommandHandler',
            localisation: 'ConversationRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Conversation not found');
      });

    const card: CardEntity = await this.cardRepository
      .findOneOrFail({
        loadEagerRelations: false,
        where: {
          id: command.cardId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddMessageWithMediaCommandHandler',
            localisation: 'CardRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Card not found');
      });

    return await this.messageRepository
      .save({
        conversation: conversation,
        card: card,
        media: command.media,
        content: command.content,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddMessageWithMediaCommandHandler',
            localisation: 'MessageRepository.save',
            error: error,
          }),
        );
        throw new Error('Message not saved');
      })
      .then(async (message: MessageEntity) => {
        await this.eventBus.publish(
          new AddMessageWithMediaEvent({
            conversationId: command.conversationId,
            cardId: command.cardId,
            mediaId: command.media.id,
            content: command.content,
          }),
        );
        return message;
      });
  }
}
