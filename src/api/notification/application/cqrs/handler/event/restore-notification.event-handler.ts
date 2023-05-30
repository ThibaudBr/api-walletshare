import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreNotificationEvent } from '../../event/restore-notification.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreNotificationEvent)
export class RestoreNotificationEventHandler implements IEventHandler<RestoreNotificationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreNotificationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Notification with ID : ' + event.notificationId + ' have been restore',
    });
  }
}
