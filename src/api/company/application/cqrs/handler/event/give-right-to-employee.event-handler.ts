import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GiveRightToEmployeeEvent } from '../../event/give-right-to-employee.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(GiveRightToEmployeeEvent)
export class GiveRightToEmployeeEventHandler implements IEventHandler<GiveRightToEmployeeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: GiveRightToEmployeeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Profile with ID : ' +
        event.profileId +
        ' have been give right : [ ' +
        event.roles.map(role => role + ' ') +
        ' ] to company with ID : ' +
        event.companyId,
    });
  }
}
