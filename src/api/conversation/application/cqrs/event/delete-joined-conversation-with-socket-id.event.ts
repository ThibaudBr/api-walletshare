export class DeleteJoinedConversationWithSocketIdEvent {
  public readonly socketId: string;
  public readonly module: string = 'conversation';
  public readonly method: string = 'delete-joined-conversation';

  constructor(partial?: Partial<DeleteJoinedConversationWithSocketIdEvent>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
