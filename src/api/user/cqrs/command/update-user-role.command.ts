import { UserRoleEnum } from '../../domain/enum/user-role.enum';

export class UpdateUserRoleCommand {
  public readonly userId: string;
  public readonly roles: UserRoleEnum[];

  constructor(partial: Partial<UpdateUserRoleCommand>) {
    Object.assign(this, partial);
  }
}
