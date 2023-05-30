export class RemoveMessageConversationCommand {
  public readonly messageId: string;

  constructor(partial: Partial<RemoveMessageConversationCommand>) {
    Object.assign(this, partial);
  }
}
