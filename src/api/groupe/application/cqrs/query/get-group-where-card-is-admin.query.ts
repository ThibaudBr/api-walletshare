export class GetGroupWhereCardIsAdminQuery {
  constructor(partial: Partial<GetGroupWhereCardIsAdminQuery>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}
