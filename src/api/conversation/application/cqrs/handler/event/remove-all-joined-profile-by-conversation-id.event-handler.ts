import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveAllJoinedProfileByConversationIdEvent } from '../../event/remove-all-joined-profile-by-conversation-id.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveAllJoinedProfileByConversationIdEvent)
export class RemoveAllJoinedProfileByConversationIdEventHandler
  implements IEventHandler<RemoveAllJoinedProfileByConversationIdEvent>
{
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveAllJoinedProfileByConversationIdEvent) {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Remove all joined profile by conversation id for conversation id: ' + event.conversationId,
    });
  }
}
