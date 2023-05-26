import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveNotificationEvent } from '../../event/remove-notification.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveNotificationEvent)
export class RemoveNotificationEventHandler implements IEventHandler<RemoveNotificationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveNotificationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Notification with ID : ' + event.notificationId + ' have been removed',
    });
  }
}
