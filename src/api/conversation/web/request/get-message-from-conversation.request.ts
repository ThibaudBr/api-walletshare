export class GetMessageFromConversationRequest {
  constructor(partial: Partial<GetMessageFromConversationRequest>) {
    Object.assign(this, partial);
  }

  public readonly conversationId: string;
  public readonly nbMessage: number;
}
