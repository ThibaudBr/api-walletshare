import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveCompanyEvent } from '../../event/soft-remove-company.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveCompanyEvent)
export class SoftRemoveCompanyEventHandler implements IEventHandler<SoftRemoveCompanyEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveCompanyEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Company with ID : ' + event.companyId + ' have been soft removed',
    });
  }
}
