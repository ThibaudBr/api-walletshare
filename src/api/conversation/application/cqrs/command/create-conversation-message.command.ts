export class CreateConversationMessageCommand {
  constructor(partial: Partial<CreateConversationMessageCommand>) {
    Object.assign(this, partial);
  }

  public readonly content: string;
  public readonly conversationId: string;
  public readonly cardId: string;
}
