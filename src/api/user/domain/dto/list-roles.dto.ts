import { UserRoleEnum } from '../enum/user-role.enum';

export class ListRolesDto {
  public readonly roles: UserRoleEnum[];

  constructor(partial: Partial<ListRolesDto>) {
    Object.assign(this, partial);
  }
}
