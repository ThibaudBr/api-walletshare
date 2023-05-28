import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMessageConversationCommand } from '../../command/remove-message-conversation.command';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveMessageConversationCommand)
export class RemoveMessageConversationCommandHandler implements ICommandHandler<RemoveMessageConversationCommand> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageConversationRepository: Repository<MessageEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveMessageConversationCommand): Promise<void> {
    const messageConversation: MessageEntity = await this.messageConversationRepository
      .findOneOrFail({
        where: {
          id: command.messageId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'DeleteJoinedConversationCommandHandler',
            localisation: 'JoinedConversationEntity.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('JoinedConversation not found');
      });
    await this.messageConversationRepository.remove(messageConversation).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'DeleteJoinedConversationCommandHandler',
          localisation: 'JoinedConversationEntity.remove',
          error: error,
        }),
      );
      throw new Error('JoinedConversation not removed');
    });
  }
}
