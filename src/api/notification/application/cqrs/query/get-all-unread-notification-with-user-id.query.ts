export class GetAllUnreadNotificationWithUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetAllUnreadNotificationWithUserIdQuery>) {
    Object.assign(this, partial);
  }
}
