export class MarkNotificationAsReadCommand {
  public readonly notificationId: string;

  constructor(params: Partial<MarkNotificationAsReadCommand>) {
    Object.assign(this, params);
  }
}
