export class CreateConversationMessageEvent {
  constructor(partial: Partial<CreateConversationMessageEvent>) {
    Object.assign(this, partial);
  }

  public readonly module: string = 'conversation';
  public readonly method: string = 'create-conversation-message';
  public readonly conversationId: string;
  public readonly cardId: string;
}
