import { RoleProfileEnum } from '../../domain/enum/role-profile.enum';

export class GetProfilesWithCriteriaRequest {
  public readonly usernameProfile?: string;
  public readonly isDeleted?: boolean;
  public readonly roleProfile?: RoleProfileEnum;

  constructor(partial: Partial<GetProfilesWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}
