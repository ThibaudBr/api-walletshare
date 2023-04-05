export class GetGroupRequestWithCardIdAndGroupIdQuery {
  constructor(params: Partial<GetGroupRequestWithCardIdAndGroupIdQuery>) {
    Object.assign(this, params);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}
