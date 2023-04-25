import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteCardEvent } from '../../event/soft-delete-card.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftDeleteCardEvent)
export class SoftDeleteCardEventHandler implements IEventHandler<SoftDeleteCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' soft deleted',
    });
  }
}
