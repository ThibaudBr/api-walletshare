import { UserRoleEnum } from '../enum/user-role.enum';

export class UserResponse {
  constructor(partial?: Partial<UserResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly id: string;
  public readonly roles: UserRoleEnum[];
  public readonly username?: string;
  public readonly email?: string;
}
