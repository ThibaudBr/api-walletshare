import { NotificationTypeEnum } from '../../domain/enum/notification-type.enum';

export class CreateNotificationAdminRequest {
  public readonly title: string;
  public readonly description: string;
  public readonly notificationTypeEnum: NotificationTypeEnum;
  public readonly link?: string;
  public readonly userIds?: string[];
  public readonly profileIds?: string[];
  public readonly conversationIds?: string[];
  public readonly forAllUser: boolean;

  constructor(partial: Partial<CreateNotificationAdminRequest>) {
    Object.assign(this, partial);
  }
}
