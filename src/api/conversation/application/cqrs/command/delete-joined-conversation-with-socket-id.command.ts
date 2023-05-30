export class DeleteJoinedConversationWithSocketIdCommand {
  public readonly socketId: string;

  constructor(partial: Partial<DeleteJoinedConversationWithSocketIdCommand>) {
    Object.assign(this, partial);
  }
}
