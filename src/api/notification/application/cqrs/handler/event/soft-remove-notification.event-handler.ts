import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveNotificationEvent } from '../../event/soft-remove-notification.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveNotificationEvent)
export class SoftRemoveNotificationEventHandler implements IEventHandler<SoftRemoveNotificationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveNotificationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Notification with ID : ' + event.notificationId + ' have been soft removed',
    });
  }
}
