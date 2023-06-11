import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveAllConnectedUserEvent } from '../../event/remove-all-connected-user.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveAllConnectedUserEvent)
export class RemoveAllConnectedUserEventHandler implements IEventHandler<RemoveAllConnectedUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveAllConnectedUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Remove all connected user',
    });
  }
}
