export class GetGroupMembershipWithCardIdQuery {
  constructor(partial: Partial<GetGroupMembershipWithCardIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
}
