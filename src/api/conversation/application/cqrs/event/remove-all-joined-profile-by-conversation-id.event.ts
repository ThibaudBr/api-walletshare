export class RemoveAllJoinedProfileByConversationIdEvent {
  public readonly conversationId: string;
  public readonly method: string = 'remove-all-joined-profile-by-conversation-id';
  public readonly module: string = 'conversation';

  constructor(partial: Partial<RemoveAllJoinedProfileByConversationIdEvent>) {
    Object.assign(this, partial);
  }
}
