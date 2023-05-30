import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MarkNotificationAsReadEvent } from '../../event/mark-notification-as-read.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(MarkNotificationAsReadEvent)
export class MarkNotificationAsReadEventHandler implements IEventHandler<MarkNotificationAsReadEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: MarkNotificationAsReadEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Notification with ID : ' + event.notificationId + ' have been mark as read',
    });
  }
}
