import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAllJoinedConversationCommand } from '../../command/delete-all-joined-conversation.command';
import { JoinedConversationEntity } from '../../../../domain/entities/joined-conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteAllJoinedConversationCommand)
export class DeleteAllJoinedConversationCommandHandler implements ICommandHandler<DeleteAllJoinedConversationCommand> {
  constructor(
    @InjectRepository(JoinedConversationEntity)
    private readonly joinedConversationRepository: Repository<JoinedConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<void> {
    const joinedConversations: JoinedConversationEntity[] = await this.joinedConversationRepository
      .find()
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'DeleteAllJoinedConversationCommandHandler',
            localisation: 'JoinedConversationEntity.find',
            error: error.message,
          }),
        );
        throw new Error('JoinedConversation not found');
      });
    await this.joinedConversationRepository.remove(joinedConversations).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'DeleteAllJoinedConversationCommandHandler',
          localisation: 'JoinedConversationEntity.remove',
          error: error.message,
        }),
      );
      throw new Error('JoinedConversation not removed');
    });
  }
}
