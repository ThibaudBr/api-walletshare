export class MarkNotificationsAsReadRequest {
  constructor(partial: Partial<MarkNotificationsAsReadRequest>) {
    Object.assign(this, partial);
  }

  public readonly notificationIds: string[];
}
