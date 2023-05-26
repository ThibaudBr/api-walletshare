export class SoftRemoveMessageConversationCommand {
  public readonly messageId: string;

  constructor(partial?: Partial<SoftRemoveMessageConversationCommand>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
