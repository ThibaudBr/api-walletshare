import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SetCurrentRefreshTokenEvent } from '../../event/set-current-refresh-token.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SetCurrentRefreshTokenEvent)
export class SetCurrentRefreshTokenEventHandler implements IEventHandler<SetCurrentRefreshTokenEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SetCurrentRefreshTokenEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Refresh token with id: ' + event.userId + ' set',
    });
  }
}
