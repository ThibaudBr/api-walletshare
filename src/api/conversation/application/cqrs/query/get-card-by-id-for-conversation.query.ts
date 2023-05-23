export class GetCardByIdForConversationQuery {
  constructor(partial?: Partial<GetCardByIdForConversationQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly cardId: string;
}
