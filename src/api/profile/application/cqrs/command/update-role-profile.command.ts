import { RoleProfileEnum } from '../../../domain/enum/role-profile.enum';

export class UpdateRoleProfileCommand {
  constructor(partial: Partial<UpdateRoleProfileCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly roleProfileEnum: RoleProfileEnum;
}
