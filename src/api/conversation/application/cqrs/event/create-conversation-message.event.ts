export class CreateConversationMessageEvent {
  public readonly module: string = 'conversation';
  public readonly method: string = 'create-conversation-message';
  public readonly conversationId: string;
  public readonly cardId: string;
  public readonly messageId: string;

  constructor(partial: Partial<CreateConversationMessageEvent>) {
    Object.assign(this, partial);
  }
}
