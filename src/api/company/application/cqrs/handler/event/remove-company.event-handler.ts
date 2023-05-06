import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveCompanyEvent } from '../../event/remove-company.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveCompanyEvent)
export class RemoveCompanyEventHandler implements IEventHandler<RemoveCompanyEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveCompanyEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Company with ID : ' + event.companyId + ' have been removed',
    });
  }
}
