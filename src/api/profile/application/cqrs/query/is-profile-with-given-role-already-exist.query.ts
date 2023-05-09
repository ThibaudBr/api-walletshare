import { RoleProfileEnum } from '../../../domain/enum/role-profile.enum';

export class IsProfileWithGivenRoleAlreadyExistQuery {
  constructor(partial: Partial<IsProfileWithGivenRoleAlreadyExistQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly roleProfile: RoleProfileEnum;
}
