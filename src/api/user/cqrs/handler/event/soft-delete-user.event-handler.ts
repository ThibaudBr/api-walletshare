import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteUserEvent } from '../../event/soft-delete-user.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(SoftDeleteUserEvent)
export class SoftDeleteUserEventHandler implements IEventHandler<SoftDeleteUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' soft deleted',
    });
  }
}
