export class SentMessageRequest {
  public readonly content: string;
  public readonly conversationId: string;
  public readonly cardId: string;

  constructor(partial: Partial<SentMessageRequest>) {
    Object.assign(this, partial);
  }
}
