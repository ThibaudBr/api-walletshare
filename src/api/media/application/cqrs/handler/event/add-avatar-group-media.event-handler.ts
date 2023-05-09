import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddAvatarGroupMediaEvent } from '../../event/add-avatar-group-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddAvatarGroupMediaEvent)
export class AddAvatarGroupMediaEventHandler implements IEventHandler<AddAvatarGroupMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddAvatarGroupMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add avatar group media for group with id: ' + event.groupId + ' and media with id: ' + event.mediaId,
    });
  }
}
