export class MarkNotificationAsReadRequest {
  public readonly notificationId: string;

  constructor(partial: Partial<MarkNotificationAsReadRequest>) {
    Object.assign(this, partial);
  }
}
