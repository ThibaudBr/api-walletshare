export class RemoveNotificationCommand {
  public readonly notificationId: string;

  constructor(params: Partial<RemoveNotificationCommand>) {
    Object.assign(this, params);
  }
}
