export class GetAllNotificationWithUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetAllNotificationWithUserIdQuery>) {
    Object.assign(this, partial);
  }
}
