export class RemoveNotificationEvent {
  public readonly notificationId: string;
  public readonly module: string = 'notification';
  public readonly method: string = 'remove-notification';

  constructor(partial: Partial<RemoveNotificationEvent>) {
    Object.assign(this, partial);
  }
}
