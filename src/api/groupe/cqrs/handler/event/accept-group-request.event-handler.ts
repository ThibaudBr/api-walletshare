import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../api-log/api-log.service';
import { AcceptGroupRequestEvent } from '../../event/accept-group-request.event';

@EventsHandler(AcceptGroupRequestEvent)
export class AcceptGroupRequestEventHandler implements IEventHandler<AcceptGroupRequestEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AcceptGroupRequestEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: 'acceptGroupRequest',
      module: 'group',
      body: 'Card with Id ' + event.cardId + ' accepted the request to join the group with Id ' + event.groupId,
    });
  }
}
