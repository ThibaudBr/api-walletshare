import { RoleProfileEnum } from '../enum/role-profile.enum';

export class CreateProfileDto {
  public readonly usernameProfile: string;
  public readonly roleProfile: RoleProfileEnum;
  constructor(partial: Partial<CreateProfileDto>) {
    Object.assign(this, partial);
  }
}
