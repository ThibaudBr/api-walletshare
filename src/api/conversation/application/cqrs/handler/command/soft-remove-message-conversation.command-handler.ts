import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveMessageConversationCommand } from '../../command/soft-remove-message-conversation.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SoftRemoveMessageConversationCommand)
export class SoftRemoveMessageConversationCommandHandler
  implements ICommandHandler<SoftRemoveMessageConversationCommand>
{
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageConversationRepository: Repository<MessageEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveMessageConversationCommand): Promise<void> {
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
    await this.messageConversationRepository.softRemove(messageConversation).catch(async error => {
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
