import { EventsHandler } from '@nestjs/cqrs';
import { RemoveCompanyEmployeeEvent } from '../../event/remove-company-employee.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveCompanyEmployeeEvent)
export class RemoveCompanyEmployeeEventHandler {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveCompanyEmployeeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with ID : ' + event.profileId + ' have been removed from company with ID : ' + event.companyId,
    });
  }
}
