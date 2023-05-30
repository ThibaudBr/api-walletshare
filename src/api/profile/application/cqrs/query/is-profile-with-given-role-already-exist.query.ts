import { RoleProfileEnum } from '../../../domain/enum/role-profile.enum';

export class IsProfileWithGivenRoleAlreadyExistQuery {
  public readonly userId: string;
  public readonly roleProfile: RoleProfileEnum;

  constructor(partial: Partial<IsProfileWithGivenRoleAlreadyExistQuery>) {
    Object.assign(this, partial);
  }
}
