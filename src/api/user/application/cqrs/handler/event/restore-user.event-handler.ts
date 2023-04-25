import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreUserEvent } from '../../event/restore-user.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreUserEvent)
export class RestoreUserEventHandler implements IEventHandler<RestoreUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' restored',
    });
  }
}
