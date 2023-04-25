import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveRefreshTokenEvent } from '../../event/remove-refresh-token.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveRefreshTokenEvent)
export class RemoveRefreshTokenEventHandler implements IEventHandler<RemoveRefreshTokenEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  handle(event: RemoveRefreshTokenEvent): void {
    this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Refresh token with id: ' + event.userId + ' removed',
    });
  }
}
