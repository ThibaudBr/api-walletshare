import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from 'src/api/api-log/application/api-log.service';
import { AddBannerProfileMediaEvent } from '../../event/add-banner-profile-media.event';

@EventsHandler(AddBannerProfileMediaEvent)
export class AddBannerProfileMediaEventHandler implements IEventHandler<AddBannerProfileMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddBannerProfileMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add banner profile media for profile with id: ' + event.profileId + ' and media with id: ' + event.mediaId,
    });
  }
}
