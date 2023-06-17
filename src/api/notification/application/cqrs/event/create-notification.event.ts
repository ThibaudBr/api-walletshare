import {NotificationTypeEnum} from "../../../domain/enum/notification-type.enum";

export class CreateNotificationEvent {
  constructor(partial: Partial<CreateNotificationEvent>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly notificationType: NotificationTypeEnum;
  public readonly method: string = 'create-notification';
  public readonly module: string = 'notification';
}
