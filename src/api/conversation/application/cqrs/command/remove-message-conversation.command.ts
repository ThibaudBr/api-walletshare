export class RemoveMessageConversationCommand {
  constructor(partial: Partial<RemoveMessageConversationCommand>) {
    Object.assign(this, partial);
  }

  public readonly messageId: string;
}
