import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateCompanyEvent } from '../../event/update-company.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateCompanyEvent)
export class UpdateCompanyEventHandler implements IEventHandler<UpdateCompanyEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateCompanyEvent) {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Company with ID : ' + event.companyId + ' have been updated',
    });
  }
}
