import { RoleProfileEnum } from "../enum/role-profile.enum";

export class UpdateProfileRequest {
  public readonly usernameProfile: string;
  public readonly idUser: string;
  public readonly roleProfile: RoleProfileEnum;
  public readonly occupationsId: string[];
  constructor(partial: Partial<UpdateProfileRequest>) {
    Object.assign(this, partial);
  }
}
