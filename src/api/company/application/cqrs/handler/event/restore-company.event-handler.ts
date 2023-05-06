import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { RestoreCompanyEvent } from '../../event/restore-company.event';

@EventsHandler(RestoreCompanyEvent)
export class RestoreCompanyEventHandler implements IEventHandler<RestoreCompanyEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreCompanyEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Company with ID : ' + event.companyId + ' have been restored',
    });
  }
}
