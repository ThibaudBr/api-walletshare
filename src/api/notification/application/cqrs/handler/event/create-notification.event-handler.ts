import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateNotificationEvent } from '../../event/create-notification.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateNotificationEvent)
export class CreateNotificationEventHandler implements IEventHandler<CreateNotificationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateNotificationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Notification created for user ' + event.userId + ' with type ' + event.notificationType,
    });
  }
}
