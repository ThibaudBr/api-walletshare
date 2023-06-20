import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAllJoinedProfileByConversationIdCommand } from '../../command/remove-all-joined-profile-by-conversation-id.command';
import { JoinedConversationEntity } from '../../../../domain/entities/joined-conversation.entity';
import { RemoveAllJoinedProfileByConversationIdEvent } from '../../event/remove-all-joined-profile-by-conversation-id.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveAllJoinedProfileByConversationIdCommand)
export class RemoveAllJoinedProfileByConversationIdCommandHandler
  implements ICommandHandler<RemoveAllJoinedProfileByConversationIdCommand>
{
  constructor(
    @InjectRepository(JoinedConversationEntity)
    private readonly joinedConversationRepository: Repository<JoinedConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveAllJoinedProfileByConversationIdCommand): Promise<void> {
    const joinedConversations: JoinedConversationEntity[] = await this.joinedConversationRepository
      .find({
        relations: ['conversation'],
        where: {
          conversation: {
            id: command.conversationId,
          },
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveAllJoinedProfileByConversationIdCommandHandler',
            localisation: 'joinedConversationRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Joined conversation not found');
      });

    await this.joinedConversationRepository
      .remove(joinedConversations)
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveAllJoinedProfileByConversationIdCommandHandler',
            localisation: 'joinedConversationRepository.remove',
            error: error.message,
          }),
        );
        throw new Error('Joined conversation not removed');
      })
      .then(async () => {
        await this.eventBus.publish(
          new RemoveAllJoinedProfileByConversationIdEvent({
            conversationId: command.conversationId,
          }),
        );
      });
  }
}
