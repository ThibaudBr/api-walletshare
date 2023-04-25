export class GetGroupMemberQuery {
  constructor(partial: Partial<GetGroupMemberQuery>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
}
