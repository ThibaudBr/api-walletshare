export class RemoveAllJoinedProfileByConversationIdCommand {
  public readonly conversationId: string;

  constructor(partial: Partial<RemoveAllJoinedProfileByConversationIdCommand>) {
    Object.assign(this, partial);
  }
}
