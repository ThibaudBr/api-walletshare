import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveMessageConversationEvent } from '../../event/remove-message-conversation.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveMessageConversationEvent)
export class RemoveMessageConversationEventHandler implements IEventHandler<RemoveMessageConversationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveMessageConversationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Message with id ' + event.messageId + ' has been deleted',
    });
  }
}
