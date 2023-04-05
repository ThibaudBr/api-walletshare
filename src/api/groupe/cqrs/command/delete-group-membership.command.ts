export class DeleteGroupMembershipCommand {
  constructor(partial: Partial<DeleteGroupMembershipCommand>) {
    Object.assign(this, partial);
  }

  public readonly groupMembershipId: string;
}
