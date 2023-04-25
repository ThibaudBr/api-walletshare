import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserRoleEvent } from '../../event/update-user-role.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateUserRoleEvent)
export class UpdateUserRoleEventHandler implements IEventHandler<UpdateUserRoleEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateUserRoleEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'User with id: ' +
        event.updateUserRoleCommand.userId +
        ' updated role with ' +
        event.updateUserRoleCommand.roles.join(', '),
    });
  }
}
