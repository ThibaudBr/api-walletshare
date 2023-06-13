import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateAccountStatusEvent } from '../../event/update-account-status.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateAccountStatusEvent)
export class UpdateAccountStatusEventHandler implements IEventHandler<UpdateAccountStatusEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateAccountStatusEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Update user account with id: ' + event.userId + ' to status: ' + event.status,
    });
  }
}
