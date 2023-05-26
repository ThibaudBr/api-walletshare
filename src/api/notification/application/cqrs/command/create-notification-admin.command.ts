import { NotificationTypeEnum } from '../../../domain/enum/notification-type.enum';

export class CreateNotificationAdminCommand {
  public readonly title: string;
  public readonly description: string;
  public readonly notificationTypeEnum: NotificationTypeEnum;
  public readonly link?: string;
  public readonly userIds?: string[];
  public readonly profileIds?: string[];
  public readonly groupIds?: string[];
  public readonly forAllUser: boolean;

  constructor(partial: Partial<CreateNotificationAdminCommand>) {
    Object.assign(this, partial);
  }
}
