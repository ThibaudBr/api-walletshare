export class SentMessageRequest {
  constructor(partial: Partial<SentMessageRequest>) {
    Object.assign(this, partial);
  }

  public readonly content: string;
  public readonly conversationId: string;
  public readonly cardId: string;
}
