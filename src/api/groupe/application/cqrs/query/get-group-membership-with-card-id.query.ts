export class GetGroupMembershipWithCardIdQuery {
  public readonly cardId: string;

  constructor(partial: Partial<GetGroupMembershipWithCardIdQuery>) {
    Object.assign(this, partial);
  }
}
