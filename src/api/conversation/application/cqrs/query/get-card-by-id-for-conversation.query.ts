export class GetCardByIdForConversationQuery {
  public readonly cardId: string;

  constructor(partial?: Partial<GetCardByIdForConversationQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
