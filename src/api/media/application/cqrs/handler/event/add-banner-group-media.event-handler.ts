import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { AddBannerGroupMediaEvent } from '../../event/add-banner-group-media.event';

@EventsHandler(AddBannerGroupMediaEvent)
export class AddBannerGroupMediaEventHandler implements IEventHandler<AddBannerGroupMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddBannerGroupMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add banner group media for group with id: ' + event.groupId + ' and media with id: ' + event.mediaId,
    });
  }
}
