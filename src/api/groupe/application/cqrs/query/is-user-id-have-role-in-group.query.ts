import { RoleGroupMembershipEnum } from '../../../domain/enum/role-group-membership.enum';

export class IsUserIdHaveRoleInGroupQuery {
  public readonly userId: string;
  public readonly groupId: string;
  public readonly roles: RoleGroupMembershipEnum[];

  constructor(partial: Partial<IsUserIdHaveRoleInGroupQuery>) {
    Object.assign(this, partial);
  }
}
