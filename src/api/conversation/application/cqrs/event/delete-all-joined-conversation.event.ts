export class DeleteAllJoinedConversationEvent {
  public readonly module: string = 'conversation';
  public readonly method: string = 'delete-all-joined-conversation';

  constructor(partial?: Partial<DeleteAllJoinedConversationEvent>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
