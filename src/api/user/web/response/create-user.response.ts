import { UserRoleEnum } from '../../domain/enum/user-role.enum';

export class CreateUserResponse {
  public readonly id: string;
  public readonly username: string;
  public readonly mail: string;
  public readonly createdAt: Date;
  public readonly roles: UserRoleEnum[];
  public readonly referralCode?: string;

  constructor(partial?: Partial<CreateUserResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
