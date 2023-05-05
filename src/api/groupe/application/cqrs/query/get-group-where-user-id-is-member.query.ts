export class GetGroupWhereUserIdIsMemberQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetGroupWhereUserIdIsMemberQuery>) {
    Object.assign(this, partial);
  }
}
