import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveConnectedCardEvent } from '../../event/remove-connected-card.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveConnectedCardEvent)
export class RemoveConnectedCardEventHandler implements IEventHandler<RemoveConnectedCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveConnectedCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' disconnected with card: ' + event.connectedCardId,
    });
  }
}
