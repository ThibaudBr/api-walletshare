export class DeleteAllJoinedConversationCommand {
  constructor(partial?: Partial<DeleteAllJoinedConversationCommand>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
