export class CreateJoinedConversationEvent {
  constructor(partial: Partial<CreateJoinedConversationEvent>) {
    Object.assign(this, partial);
  }

  public readonly conversationId: string;
  public readonly cardId: string;
  public readonly socketId: string;
  public readonly module: string = 'conversation';
  public readonly method: string = 'create-joined-conversation';
}
