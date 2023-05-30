export class GetConversationWhereUserConnectedQuery {
  public readonly socketId: string;

  constructor(partial?: Partial<GetConversationWhereUserConnectedQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
