import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateGroupEvent } from '../../event/update-group.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(UpdateGroupEvent)
export class UpdateGroupEventHandler implements IEventHandler<UpdateGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Group with id ' + event.groupId + ' have been updated',
    });
  }
}
