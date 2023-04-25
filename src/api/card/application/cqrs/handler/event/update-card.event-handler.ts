import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateCardEvent } from '../../event/update-card.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateCardEvent)
export class UpdateCardEventHandler implements IEventHandler<UpdateCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' updated',
    });
  }
}
