import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveMessageConversationEvent } from '../../event/soft-remove-message-conversation.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveMessageConversationEvent)
export class SoftRemoveMessageConversationEventHandler implements IEventHandler<SoftRemoveMessageConversationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveMessageConversationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Message with id ' + event.messageId + ' has been soft deleted',
    });
  }
}
