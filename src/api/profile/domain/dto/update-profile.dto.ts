import { RoleProfileEnum } from '../enum/role-profile.enum';

export class UpdateProfileDto {
  public readonly usernameProfile?: string;
  public readonly roleProfile?: RoleProfileEnum;
}
