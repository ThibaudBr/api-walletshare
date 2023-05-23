export class SoftRemoveMessageConversationCommand {
  constructor(partial?: Partial<SoftRemoveMessageConversationCommand>
  ) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly messageId: string;
}
