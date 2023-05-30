import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateJoinedConversationEvent } from '../../event/create-joined-conversation.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateJoinedConversationEvent)
export class CreateJoinedConversationEventHandler implements IEventHandler<CreateJoinedConversationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateJoinedConversationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'User with profile id : ' +
        event.profileId +
        ' socket id ' +
        event.socketId +
        ' joined conversation with id ' +
        event.conversationId,
    });
  }
}
