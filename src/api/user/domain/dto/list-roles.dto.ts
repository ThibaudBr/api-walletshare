import { UserRoleEnum } from '../enum/user-role.enum';

export class ListRolesDto {
  constructor(partial: Partial<ListRolesDto>) {
    Object.assign(this, partial);
  }

  public readonly roles: UserRoleEnum[];
}
