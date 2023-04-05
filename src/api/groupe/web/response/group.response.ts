import { GroupMembershipResponse } from './group-membership.response';

export class GroupResponse {
  constructor(partial: Partial<GroupResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public readonly groupMemberships: GroupMembershipResponse[];
  public readonly groupRequests: GroupMembershipResponse[];
}
