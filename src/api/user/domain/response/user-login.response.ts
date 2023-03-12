import { UserEntity } from '../entities/user.entity';
import { UserRoleEnum } from '../enum/user-role.enum';

export class UserLoginResponse {
  constructor(partial?: Partial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly id: string;
  public readonly username?: string;
  public readonly email?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public token: string;
  public readonly roles: UserRoleEnum[];
  public password?: string;
}
