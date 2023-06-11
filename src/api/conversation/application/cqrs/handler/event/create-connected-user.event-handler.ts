import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateConnectedUserEvent } from '../../event/create-connected-user.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateConnectedUserEvent)
export class CreateConnectedUserEventHandler implements IEventHandler<CreateConnectedUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateConnectedUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Create new connected user for user ' + event.userId + ' with socketId ' + event.socketId,
    });
  }
}
