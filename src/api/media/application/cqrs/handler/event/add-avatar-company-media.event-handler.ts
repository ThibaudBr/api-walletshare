import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddAvatarCompanyMediaEvent } from '../../event/add-avatar-company-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddAvatarCompanyMediaEvent)
export class AddAvatarCompanyMediaEventHandler implements IEventHandler<AddAvatarCompanyMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddAvatarCompanyMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add avatar company media for company with id: ' + event.companyId + ' and media with id: ' + event.mediaId,
    });
  }
}
