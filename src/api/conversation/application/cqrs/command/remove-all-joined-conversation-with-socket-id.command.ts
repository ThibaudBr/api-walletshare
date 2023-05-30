export class RemoveAllJoinedConversationWithSocketIdCommand {
  public readonly socketId: string;

  constructor(partial: Partial<RemoveAllJoinedConversationWithSocketIdCommand>) {
    Object.assign(this, partial);
  }
}
