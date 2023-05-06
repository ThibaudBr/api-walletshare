import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddCompanyEmployeeEvent } from '../../event/add-company-employee.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(AddCompanyEmployeeEvent)
export class AddCompanyEmployeeEventHandler implements IEventHandler<AddCompanyEmployeeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddCompanyEmployeeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Profile with ID : ' +
        event.profileId +
        ' have been add to company with ID : ' +
        event.companyId +
        ' with role : ' +
        event.roles.map(role => role + ' '),
    });
  }
}
