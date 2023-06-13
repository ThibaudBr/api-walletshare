import { RoleProfileEnum } from '../../../domain/enum/role-profile.enum';

export class UpdateRoleProfileCommand {
  public readonly profileId: string;
  public readonly roleProfileEnum: RoleProfileEnum;

  constructor(partial: Partial<UpdateRoleProfileCommand>) {
    Object.assign(this, partial);
  }
}
