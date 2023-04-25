import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateGroupEvent } from '../../event/create-group.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateGroupEvent)
export class CreateGroupEventHandler implements IEventHandler<CreateGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Card with id ' + event.cardId + ' create a new group with id ' + event.groupId,
    });
  }
}
