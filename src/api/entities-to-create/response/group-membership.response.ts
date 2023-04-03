export class GroupMembershipResponse {
  constructor(partial: Partial<GroupMembershipResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly groupId: string;
  public readonly profileId: string;
  public readonly isDeleted?: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}
