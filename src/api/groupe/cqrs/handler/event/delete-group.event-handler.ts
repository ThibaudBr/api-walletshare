import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from 'src/api/api-log/api-log.service';
import { DeleteGroupEvent } from '../../event/delete-group.event';

@EventsHandler(DeleteGroupEvent)
export class DeleteGroupEventHandler implements IEventHandler<DeleteGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Group with id ' + event.groupId + ' have been deleted',
    });
  }
}
