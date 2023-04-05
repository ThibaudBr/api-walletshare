export class GetGroupWhereUserIdIsMemberQuery {
  constructor(partial: Partial<GetGroupWhereUserIdIsMemberQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
