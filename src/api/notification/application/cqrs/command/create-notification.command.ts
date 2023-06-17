import {NotificationTypeEnum} from "../../../domain/enum/notification-type.enum";

export class CreateNotificationCommand {
  constructor(partial: Partial<CreateNotificationCommand>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly conversationId?: string;
  public readonly notificationType: NotificationTypeEnum;
  public readonly notificationMessage: string;
  public readonly notificationTitle: string;
}
