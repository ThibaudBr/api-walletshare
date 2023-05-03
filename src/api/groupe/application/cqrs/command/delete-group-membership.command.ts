export class DeleteGroupMembershipCommand {
  public readonly groupMembershipId: string;

  constructor(partial: Partial<DeleteGroupMembershipCommand>) {
    Object.assign(this, partial);
  }
}
