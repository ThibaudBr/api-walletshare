export class DeleteJoinedConversationWithSocketIdCommand {
  constructor(partial: Partial<DeleteJoinedConversationWithSocketIdCommand>) {
    Object.assign(this, partial);
  }

  public readonly socketId: string;
}
