import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddConnectedCardEvent } from '../../event/add-connected-card.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(AddConnectedCardEvent)
export class AddConnectedCardEventHandler implements IEventHandler<AddConnectedCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddConnectedCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.id + ' connected with card: ' + event.connectedCardId,
    });
  }
}
