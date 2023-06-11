import { UserAccountStatusEnum } from '../../../../user/domain/enum/user-account-status.enum';
import { UserRoleEnum } from '../../../../user/domain/enum/user-role.enum';
import { RoleProfileEnum } from '../../../../profile/domain/enum/role-profile.enum';

export class CreateProductRequest {
  public readonly name: string;
  public readonly description: string;
  public readonly userAccountStatus: UserAccountStatusEnum;
  public readonly userRoleToGive: UserRoleEnum;
  public readonly profileRoleToGive: RoleProfileEnum;

  constructor(partial: Partial<CreateProductRequest>) {
    Object.assign(this, partial);
  }
}
