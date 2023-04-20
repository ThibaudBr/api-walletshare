import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddCardToGroupEvent } from '../../event/add-card-to-group.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(AddCardToGroupEvent)
export class AddCardToGroupEventHandler implements IEventHandler<AddCardToGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AddCardToGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with ID : ' + event.cardId + ' have been add to group with ID : ' + event.groupId,
    });
  }
}
