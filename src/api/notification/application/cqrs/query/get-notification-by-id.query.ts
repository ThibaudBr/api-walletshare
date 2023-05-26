export class GetNotificationByIdQuery {
  public readonly notificationId: string;

  constructor(partial: Partial<GetNotificationByIdQuery>) {
    Object.assign(this, partial);
  }
}
