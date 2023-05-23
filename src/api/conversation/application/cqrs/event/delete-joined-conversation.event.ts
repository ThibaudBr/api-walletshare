export class DeleteJoinedConversationEvent {
  constructor(partial?: Partial<DeleteJoinedConversationEvent>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly socketId: string;
  public readonly module: string = 'conversation';
  public readonly method: string = 'delete-joined-conversation';
}
