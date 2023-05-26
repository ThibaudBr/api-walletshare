import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteJoinedConversationWithSocketIdEvent } from '../../event/delete-joined-conversation-with-socket-id.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(DeleteJoinedConversationWithSocketIdEvent)
export class DeleteJoinedConversationWithSocketIdEventHandler
  implements IEventHandler<DeleteJoinedConversationWithSocketIdEvent>
{
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteJoinedConversationWithSocketIdEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with socket id ' + event.socketId + ' left conversation',
    });
  }
}
