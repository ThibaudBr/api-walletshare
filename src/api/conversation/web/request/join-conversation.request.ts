export class JoinConversationRequest {
  public readonly conversationId: string;
  public readonly cardId: string;

  constructor(partial: Partial<JoinConversationRequest>) {
    Object.assign(this, partial);
  }
}
