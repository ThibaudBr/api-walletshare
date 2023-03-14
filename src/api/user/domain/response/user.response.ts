import { UserRoleEnum } from '../enum/user-role.enum';

export class UserResponse {
  constructor(partial?: Partial<UserResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly id: string;
  public readonly userRoles: UserRoleEnum[];
  public readonly username?: string;
  public readonly email?: string;
}
