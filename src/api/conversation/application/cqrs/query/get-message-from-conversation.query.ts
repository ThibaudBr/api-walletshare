export class GetMessageFromConversationQuery {
  public readonly conversationId: string;
  public readonly nbMessage?: number;
  public readonly skip?: number;
  public readonly socketId?: string;

  constructor(partial: Partial<GetMessageFromConversationQuery>) {
    Object.assign(this, partial);
  }
}
