export class GetConversationByIdQuery {
  public readonly conversationId: string;

  constructor(partial: Partial<GetConversationByIdQuery>) {
    Object.assign(this, partial);
  }
}
