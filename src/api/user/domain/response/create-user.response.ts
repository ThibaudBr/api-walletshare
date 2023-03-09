import { UserRoleEnum } from '../../../entities-to-create/enum/user-role.enum';
import { UserEntity } from '../entities/user.entity';

export class CreateUserResponse {
  constructor(partial?: Partial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public readonly roles: UserRoleEnum[];
}
