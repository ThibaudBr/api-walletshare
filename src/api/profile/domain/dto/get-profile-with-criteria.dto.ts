import { RoleProfileEnum } from '../enum/role-profile.enum';

export class GetProfileWithCriteriaDto {
  public readonly usernameProfile?: string;
  public readonly isDeleted?: boolean;

  public readonly roleProfile?: RoleProfileEnum;

  constructor(partial: Partial<GetProfileWithCriteriaDto>) {
    Object.assign(this, partial);
  }
}
