export class DeleteGroupMembershipEvent {
  constructor(partial: Partial<DeleteGroupMembershipEvent>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'delete-group-membership-request';
}
