import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from 'src/api/api-log/api-log.service';
import { DeleteGroupMembershipEvent } from '../../event/delete-group-membership.event';

@EventsHandler(DeleteGroupMembershipEvent)
export class DeleteGroupMembershipEventHandler implements IEventHandler<DeleteGroupMembershipEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteGroupMembershipEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'GroupMembership with id ' + event.groupId + ' deleted',
    });
  }
}
