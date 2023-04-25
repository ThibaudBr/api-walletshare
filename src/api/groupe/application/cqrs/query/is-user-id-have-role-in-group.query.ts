import { RoleGroupMembershipEnum } from '../../../domain/enum/role-group-membership.enum';

export class IsUserIdHaveRoleInGroupQuery {
  constructor(partial: Partial<IsUserIdHaveRoleInGroupQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly groupId: string;
  public readonly roles: RoleGroupMembershipEnum[];
}
