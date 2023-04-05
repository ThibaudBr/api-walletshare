import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendGroupRequestEvent } from '../../event/send-group-request.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(SendGroupRequestEvent)
export class SendGroupRequestEventHandler implements IEventHandler<SendGroupRequestEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SendGroupRequestEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Card with id ' + event.cardId + ' have been send a request to join group with id ' + event.groupId,
    });
  }
}
