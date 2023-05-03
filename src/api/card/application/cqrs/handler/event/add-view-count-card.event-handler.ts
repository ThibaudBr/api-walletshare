import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddViewCountCardEvent } from '../../event/add-view-count-card.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddViewCountCardEvent)
export class AddViewCountCardEventHandler implements IEventHandler<AddViewCountCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddViewCountCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Card with id: ' +
        event.cardId +
        ' has been viewed and the view id is ' +
        event.cardView +
        ' and the view count is ' +
        event.cardViewCount,
    });
  }
}
