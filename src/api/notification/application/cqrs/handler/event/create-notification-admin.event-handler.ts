import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { CreateNotificationAdminEvent } from '../../event/create-notification-admin.event';

@EventsHandler(CreateNotificationAdminEvent)
export class CreateNotificationAdminEventHandler implements IEventHandler<CreateNotificationAdminEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateNotificationAdminEvent): Promise<void> {
    let createdNotificationBody = 'Notification created by admin of type' + event.notificationTypeEnum;
    if (event.groupIds) {
      createdNotificationBody += ' for conversations : ' + event.groupIds;
    }
    if (event.userIds) {
      createdNotificationBody += ' for users : ' + event.userIds;
    }
    if (event.profileIds) {
      createdNotificationBody += ' for profiles : ' + event.profileIds;
    }

    if (event.forAllUser) {
      createdNotificationBody += ' for all user types';
    }
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: createdNotificationBody,
    });
  }
}
