export class SoftRemoveNotificationEvent {
  public readonly notificationId: string;
  public readonly module: string = 'notification';
  public readonly method: string = 'soft-remove-notification';

  constructor(partial: Partial<SoftRemoveNotificationEvent>) {
    Object.assign(this, partial);
  }
}
