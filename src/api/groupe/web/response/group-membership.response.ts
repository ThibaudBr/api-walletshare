import { CardResponse } from '../../../card/web/response/card.response';
import { RoleGroupMembershipEnum } from '../../domain/enum/role-group-membership.enum';
import { GroupResponse } from './group.response';

export class GroupMembershipResponse {
  public readonly id: string;
  public readonly cardResponse?: CardResponse;
  public readonly cardId: string;
  public readonly groupId: string;
  public readonly groupResponse?: GroupResponse;
  public readonly role: RoleGroupMembershipEnum;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<GroupMembershipResponse>) {
    Object.assign(this, partial);
  }
}
