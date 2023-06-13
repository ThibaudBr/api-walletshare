import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteGroupEvent } from '../../event/soft-delete-group.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftDeleteGroupEvent)
export class SoftDeleteGroupEventHandler implements IEventHandler<SoftDeleteGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Group with id ' + event.groupId + ' has been soft deleted',
    });
  }
}
