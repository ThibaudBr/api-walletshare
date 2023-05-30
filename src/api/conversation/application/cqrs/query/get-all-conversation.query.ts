export class GetAllConversationQuery {
  constructor(partial?: Partial<GetAllConversationQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
