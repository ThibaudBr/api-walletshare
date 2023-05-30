export class CreateJoinedConversationEvent {
  public readonly conversationId: string;
  public readonly profileId: string;
  public readonly socketId: string;
  public readonly module: string = 'conversation';
  public readonly method: string = 'create-joined-conversation';

  constructor(partial: Partial<CreateJoinedConversationEvent>) {
    Object.assign(this, partial);
  }
}
