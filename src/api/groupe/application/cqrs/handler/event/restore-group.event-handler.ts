import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreGroupEvent } from '../../event/restore-group.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreGroupEvent)
export class RestoreGroupEventHandler implements IEventHandler<RestoreGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Group with id ' + event.groupId + ' has been restored',
    });
  }
}
