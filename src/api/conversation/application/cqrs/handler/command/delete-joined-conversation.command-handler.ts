import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteJoinedConversationWithSocketIdCommand } from '../../command/delete-joined-conversation-with-socket-id.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { JoinedConversationEntity } from '../../../../domain/entities/joined-conversation.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteJoinedConversationWithSocketIdCommand)
export class DeleteJoinedConversationCommandHandler
  implements ICommandHandler<DeleteJoinedConversationWithSocketIdCommand>
{
  constructor(
    @InjectRepository(JoinedConversationEntity)
    private readonly joinedConversationRepository: Repository<JoinedConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteJoinedConversationWithSocketIdCommand): Promise<void> {
    const joinedConversation: JoinedConversationEntity = await this.joinedConversationRepository
      .findOneOrFail({
        where: {
          socketId: command.socketId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'DeleteJoinedConversationCommandHandler',
            localisation: 'JoinedConversationEntity.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('JoinedConversation not found');
      });
    await this.joinedConversationRepository.remove(joinedConversation).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'DeleteJoinedConversationCommandHandler',
          localisation: 'JoinedConversationEntity.remove',
          error: error.message,
        }),
      );
      throw new Error('JoinedConversation not removed');
    });
  }
}
