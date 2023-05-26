export class MarkNotificationAsReadEvent {
  public readonly notificationId: string;
  public readonly module: string = 'notification';
  public readonly method: string = 'mark-notification-as-read';

  constructor(partial: Partial<MarkNotificationAsReadEvent>) {
    Object.assign(this, partial);
  }
}
