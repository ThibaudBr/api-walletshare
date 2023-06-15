import { UserRoleEnum } from '../enum/user-role.enum';

export class GenerateUserDto {
  public readonly mail: string;
  public readonly roles: UserRoleEnum[];
  public readonly language: string = 'fr';

  constructor(partial: Partial<GenerateUserDto>) {
    Object.assign(this, partial);
  }
}
