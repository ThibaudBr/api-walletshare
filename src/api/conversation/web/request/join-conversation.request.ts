export class JoinConversationRequest {
  constructor(partial: Partial<JoinConversationRequest>) {
    Object.assign(this, partial);
  }

  public readonly conversationId: string;
  public readonly cardId: string;
}
