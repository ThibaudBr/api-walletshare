import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveConnectedUserBySocketIdEvent } from '../../event/remove-connected-user-by-socket-id.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveConnectedUserBySocketIdEvent)
export class RemoveConnectedUserBySocketIdEventHandler implements IEventHandler<RemoveConnectedUserBySocketIdEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveConnectedUserBySocketIdEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Remove connected user with socketId ' + event.socketId,
    });
  }
}
