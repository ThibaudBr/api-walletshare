import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateCompanyEvent } from '../../event/create-company.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateCompanyEvent)
export class CreateCompanyEventHandler implements IEventHandler<CreateCompanyEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateCompanyEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Company with ID : ' + event.companyId + ' have been created by profile with ID : ' + event.profileId,
    });
  }
}
