export class GetGroupWhereCardIsAdminQuery {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<GetGroupWhereCardIsAdminQuery>) {
    Object.assign(this, partial);
  }
}
