export class DeleteGroupMembershipEvent {
  public readonly groupMembershipId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'delete-group-membership-request';

  constructor(partial: Partial<DeleteGroupMembershipEvent>) {
    Object.assign(this, partial);
  }
}
