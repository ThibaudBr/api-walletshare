import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddBannerCompanyMediaEvent } from '../../event/add-banner-company-media.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddBannerCompanyMediaEvent)
export class AddBannerCompanyMediaEventHandler implements IEventHandler<AddBannerCompanyMediaEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddBannerCompanyMediaEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add banner company media for company with id: ' + event.companyId + ' and media with id: ' + event.mediaId,
    });
  }
}
