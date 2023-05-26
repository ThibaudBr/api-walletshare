export class CreateConversationMessageCommand {
  public readonly content: string;
  public readonly conversationId: string;
  public readonly cardId: string;

  constructor(partial: Partial<CreateConversationMessageCommand>) {
    Object.assign(this, partial);
  }
}
