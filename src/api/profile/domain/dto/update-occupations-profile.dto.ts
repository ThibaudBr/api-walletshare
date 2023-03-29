import { RoleProfileEnum } from '../enum/role-profile.enum';

export class UpdateOccupationsProfileDto {
  public readonly roleProfile?: RoleProfileEnum;

  constructor(partial: Partial<UpdateOccupationsProfileDto>) {
    Object.assign(this, partial);
  }
}
