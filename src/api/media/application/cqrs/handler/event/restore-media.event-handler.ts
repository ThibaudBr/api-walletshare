import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { RestoreMediaEvent } from '../../event/restore-media.event';

@EventsHandler(RestoreMediaEvent)
export class RestoreMediaEventHandler implements IEventHandler<RestoreMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Restore media with media id: ( ' + event.mediaId + ' )',
    });
  }
}
