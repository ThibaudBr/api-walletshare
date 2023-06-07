import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddCardPresetMediaEvent } from '../../event/add-card-preset-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddCardPresetMediaEvent)
export class AddCardPresetMediaEventHandler implements IEventHandler<AddCardPresetMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddCardPresetMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      body: 'Add media for card preset with id: ' + event.cardPresetId + ' and media id: ' + event.mediaId,
      method: event.method,
      module: event.module,
    });
  }
}
