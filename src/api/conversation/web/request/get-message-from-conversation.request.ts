export class GetMessageFromConversationRequest {
  public readonly conversationId: string;
  public readonly nbMessage: number;

  constructor(partial: Partial<GetMessageFromConversationRequest>) {
    Object.assign(this, partial);
  }
}
