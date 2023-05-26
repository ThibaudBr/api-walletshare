export class RestoreNotificationEvent {
  public readonly notificationId: string;
  public readonly module: string = 'notification';
  public readonly method: string = 'restore-notification';

  constructor(partial: Partial<RestoreNotificationEvent>) {
    Object.assign(this, partial);
  }
}
