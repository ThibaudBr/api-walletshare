import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CancelGroupRequestEvent } from '../../event/cancel-group-request.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(CancelGroupRequestEvent)
export class CancelGroupRequestEventHandler implements IEventHandler<CancelGroupRequestEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CancelGroupRequestEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id ' + event.cardId + ' cancel request for groupId ' + event.groupId,
    });
  }
}
