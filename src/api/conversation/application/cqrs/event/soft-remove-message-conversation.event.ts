export class SoftRemoveMessageConversationEvent {
  constructor(partial?: Partial<SoftRemoveMessageConversationEvent>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly messageId: string;
  public readonly conversationId: string;
  public readonly cardId: string;
  public readonly method: string = 'soft-remove-message-conversation';
  public readonly module: string = 'conversation';
}
