export class GetMessageFromConversationRequest {
  public readonly conversationId: string;
  public readonly nbMessage?: number;
  public readonly skip?: number;

  constructor(partial: Partial<GetMessageFromConversationRequest>) {
    Object.assign(this, partial);
  }
}
