import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UploadMediaEvent } from '../../event/upload-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UploadMediaEvent)
export class UploadMediaEventHandler implements IEventHandler<UploadMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UploadMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Upload media with id: ( ' + event.id + ' ) with key: ' + event.key + ' and url: ' + event.url,
    });
  }
}
