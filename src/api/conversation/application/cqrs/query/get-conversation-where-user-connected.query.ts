export class GetConversationWhereUserConnectedQuery {
  constructor(partial?: Partial<GetConversationWhereUserConnectedQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly socketId: string;
}
