export class RemoveAllJoinedConversationWithSocketIdEvent {
  public readonly method: string = 'remove-all-joined-conversation-with-socket-id';
  public readonly module: string = 'conversation';
  public readonly socketId: string;

  constructor(partial: Partial<RemoveAllJoinedConversationWithSocketIdEvent>) {
    Object.assign(this, partial);
  }
}
