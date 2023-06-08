import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserEvent } from '../../event/update-user.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateUserEvent)
export class UpdateUserEventHandler implements IEventHandler<UpdateUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' updated',
    });
  }
}
