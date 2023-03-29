import { RoleProfileEnum } from '../enum/role-profile.enum';

export class CreateProfileRequest {
  public readonly usernameProfile: string;
  public readonly idUser: string;
  public readonly roleProfile: RoleProfileEnum;
  public readonly occupationsId: string[];
  constructor(partial: Partial<CreateProfileRequest>) {
    Object.assign(this, partial);
  }
}
