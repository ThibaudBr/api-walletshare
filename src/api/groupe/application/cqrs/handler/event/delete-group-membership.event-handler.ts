import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteGroupMembershipEvent } from '../../event/delete-group-membership.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

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
