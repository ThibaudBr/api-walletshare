export class SoftRemoveNotificationCommand {
  public readonly notificationId: string;

  constructor(params: Partial<SoftRemoveNotificationCommand>) {
    Object.assign(this, params);
  }
}
