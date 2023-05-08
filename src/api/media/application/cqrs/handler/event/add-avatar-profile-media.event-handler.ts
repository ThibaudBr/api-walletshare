import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddAvatarProfileMediaEvent } from '../../event/add-avatar-profile-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddAvatarProfileMediaEvent)
export class AddAvatarProfileMediaEventHandler implements IEventHandler<AddAvatarProfileMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddAvatarProfileMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add avatar profile with profile id: ( ' + event.profileId + ' ) and media id: ' + event.mediaId,
    });
  }
}
