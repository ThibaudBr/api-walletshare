import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveMediaEvent } from '../../event/soft-remove-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveMediaEvent)
export class SoftRemoveMediaEventHandler implements IEventHandler<SoftRemoveMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Soft remove media with media id: ( ' + event.mediaId + ' )',
    });
  }
}
