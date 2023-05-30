import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateConversationMessageEvent } from '../../event/create-conversation-message.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateConversationMessageEvent)
export class CreateConversationMessageEventHandler implements IEventHandler<CreateConversationMessageEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateConversationMessageEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Message with id ' +
        event.messageId +
        'created for conversation : ' +
        event.conversationId +
        ' by author : ' +
        event.cardId,
    });
  }
}
