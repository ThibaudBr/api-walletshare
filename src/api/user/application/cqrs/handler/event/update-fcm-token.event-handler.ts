import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateFcmTokenEvent } from '../../event/update-fcm-token.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateFcmTokenEvent)
export class UpdateFcmTokenEventHandler implements IEventHandler<UpdateFcmTokenEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateFcmTokenEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id : ' + event.userId + ' has updated his fcm token with : ' + event.fcmToken,
    });
  }
}
