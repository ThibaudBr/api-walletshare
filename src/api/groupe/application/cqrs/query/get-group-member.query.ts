export class GetGroupMemberQuery {
  public readonly groupId: string;

  constructor(partial: Partial<GetGroupMemberQuery>) {
    Object.assign(this, partial);
  }
}
