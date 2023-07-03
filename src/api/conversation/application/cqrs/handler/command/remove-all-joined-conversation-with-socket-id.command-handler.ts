import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAllJoinedConversationWithSocketIdCommand } from '../../command/remove-all-joined-conversation-with-socket-id.command';
import { JoinedConversationEntity } from '../../../../domain/entities/joined-conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(RemoveAllJoinedConversationWithSocketIdCommand)
export class RemoveAllJoinedConversationWithSocketIdCommandHandler
  implements ICommandHandler<RemoveAllJoinedConversationWithSocketIdCommand>
{
  constructor(
    @InjectRepository(JoinedConversationEntity)
    private readonly joinedConversationRepository: Repository<JoinedConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveAllJoinedConversationWithSocketIdCommand): Promise<void> {
    const joinedConversationEntities: JoinedConversationEntity[] = await this.joinedConversationRepository
      .find({
        where: {
          socketId: command.socketId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveAllJoinedConversationWithSocketIdCommandHandler',
            localisation: 'JoinedConversationEntity.find',
            error: error.message,
          }),
        );
        throw new Error('JoinedConversation not found');
      });

    if (!joinedConversationEntities) return;
    await this.joinedConversationRepository.remove(joinedConversationEntities).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RemoveAllJoinedConversationWithSocketIdCommandHandler',
          localisation: 'JoinedConversationEntity.remove',
          error: error.message,
        }),
      );
      throw new Error('JoinedConversation not removed');
    });
  }
}
