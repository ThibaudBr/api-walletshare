import { RoleProfileEnum } from '../enum/role-profile.enum';

export class UpdateProfileRequest {
  public readonly id: string;
  public readonly usernameProfile: string;
  public readonly roleProfile: RoleProfileEnum;
  public readonly occupationsId: string[];
  constructor(partial: Partial<UpdateProfileRequest>) {
    Object.assign(this, partial);
  }
}
