import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddCardMediaEvent } from '../../event/add-card-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddCardMediaEvent)
export class AddCardMediaEventHandler implements IEventHandler<AddCardMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddCardMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add card media for card with id: ' + event.cardId + ' and media with id: ' + event.mediaId,
    });
  }
}
