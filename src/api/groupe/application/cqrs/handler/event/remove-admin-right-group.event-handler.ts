import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveAdminRightGroupEvent } from '../../event/remove-admin-right-group.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveAdminRightGroupEvent)
export class RemoveAdminRightGroupEventHandler implements IEventHandler<RemoveAdminRightGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveAdminRightGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Card with id ' + event.cardId + ' have been removed admin right on group with id ' + event.groupId,
    });
  }
}
