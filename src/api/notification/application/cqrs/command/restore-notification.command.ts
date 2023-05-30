export class RestoreNotificationCommand {
  public readonly notificationId: string;

  constructor(partial: Partial<RestoreNotificationCommand>) {
    Object.assign(this, partial);
  }
}
