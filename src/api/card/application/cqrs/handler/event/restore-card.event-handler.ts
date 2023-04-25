import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreCardEvent } from '../../event/restore-card.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreCardEvent)
export class RestoreCardEventHandler implements IEventHandler<RestoreCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' restored',
    });
  }
}
