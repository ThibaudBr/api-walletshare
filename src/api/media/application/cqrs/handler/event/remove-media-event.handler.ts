import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveMediaEvent } from '../../event/remove-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveMediaEvent)
export class RemoveMediaEventHandler implements IEventHandler<RemoveMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Remove media with media id: ( ' + event.mediaId + ' )',
    });
  }
}
