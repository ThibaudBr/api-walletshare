import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddMessageWithMediaEvent } from '../../event/add-message-with-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddMessageWithMediaEvent)
export class AddMessageWithMediaEventHandler implements IEventHandler<AddMessageWithMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddMessageWithMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body:
        'Add message with media for conversation with id: ' +
        event.conversationId +
        ' and media with id: ' +
        event.mediaId +
        ' and card with id: ' +
        event.cardId,
    });
  }
}
