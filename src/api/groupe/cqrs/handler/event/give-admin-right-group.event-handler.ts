import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GiveAdminRightGroupEvent } from '../../event/give-admin-right-group.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(GiveAdminRightGroupEvent)
export class GiveAdminRightGroupEventHandler implements IEventHandler<GiveAdminRightGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: GiveAdminRightGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Card with id ' + event.cardId + ' have been granted admin right on group with id ' + event.groupId,
    });
  }
}
