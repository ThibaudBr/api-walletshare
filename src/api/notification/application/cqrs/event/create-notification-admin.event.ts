import { NotificationTypeEnum } from '../../../domain/enum/notification-type.enum';

export class CreateNotificationAdminEvent {
  public readonly userIds?: string[];
  public readonly profileIds?: string[];
  public readonly groupIds?: string[];
  public readonly forAllUser: boolean = false;
  public readonly notificationTypeEnum: NotificationTypeEnum;
  public readonly module: string = 'notification';
  public readonly method: string = 'create-notification-admin';

  constructor(partial: Partial<CreateNotificationAdminEvent>) {
    Object.assign(this, partial);
  }
}
