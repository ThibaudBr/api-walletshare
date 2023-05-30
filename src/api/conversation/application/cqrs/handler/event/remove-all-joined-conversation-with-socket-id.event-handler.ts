import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveAllJoinedConversationWithSocketIdEvent } from '../../event/remove-all-joined-conversation-with-socket-id.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveAllJoinedConversationWithSocketIdEvent)
export class RemoveAllJoinedConversationWithSocketIdEventHandler
  implements IEventHandler<RemoveAllJoinedConversationWithSocketIdEvent>
{
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveAllJoinedConversationWithSocketIdEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Soft remove all joined conversation with socket id' + event.socketId,
    });
  }
}
