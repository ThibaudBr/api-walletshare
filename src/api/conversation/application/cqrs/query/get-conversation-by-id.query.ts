export class GetConversationByIdQuery {
  constructor(partial: Partial<GetConversationByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly conversationId: string;
}
