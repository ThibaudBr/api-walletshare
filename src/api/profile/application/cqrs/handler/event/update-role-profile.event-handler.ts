import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateRoleProfileEvent } from '../../event/update-role-profile.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateRoleProfileEvent)
export class UpdateRoleProfileEventHandler implements IEventHandler<UpdateRoleProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateRoleProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Update role profile with id: ' + event.profileId + ' and role : ' + event.roleProfileEnum,
    });
  }
}
