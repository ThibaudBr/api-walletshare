export class RemoveMessageConversationEvent {
  constructor(partial: Partial<RemoveMessageConversationEvent>) {
    Object.assign(this, partial);
  }

  public readonly messageId: string;
  public readonly conversationId: string;
  public readonly cardId: string;
  public readonly method: string = 'remove-message-conversation';
  public readonly module: string = 'conversation';
}
