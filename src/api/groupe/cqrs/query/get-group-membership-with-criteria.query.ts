import { RoleGroupMembershipEnum } from '../../domain/enum/role-group-membership.enum';

export class GetGroupMembershipWithCriteriaQuery {
  constructor(partial: Partial<GetGroupMembershipWithCriteriaQuery>) {
    Object.assign(this, partial);
  }

  public cardId?: string;
  public groupId?: string;
  public isDeleted?: boolean;
  public roles?: RoleGroupMembershipEnum[];
  public createdAtFrom?: Date;
  public createdAtTo?: Date;
  public updatedAtFrom?: Date;
  public updatedAtTo?: Date;
  public deletedAtFrom?: Date;
  public deletedAtTo?: Date;
}
