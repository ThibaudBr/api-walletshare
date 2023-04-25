import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveCardFromGroupEvent } from '../../event/remove-card-from-group.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveCardFromGroupEvent)
export class RemoveCardFromGroupEventHandler implements IEventHandler<RemoveCardFromGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveCardFromGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Card with id ' + event.cardId + ' have been removed from group with id ' + event.groupId,
    });
  }
}
