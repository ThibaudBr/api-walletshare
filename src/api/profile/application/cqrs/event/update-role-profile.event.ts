import { RoleProfileEnum } from '../../../domain/enum/role-profile.enum';

export class UpdateRoleProfileEvent {
  constructor(partial: Partial<UpdateRoleProfileEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly roleProfileEnum: RoleProfileEnum;
  public readonly method: string = 'update-role-profile';
  public readonly module: string = 'profile';
}
