import { UserRoleEnum } from '../../domain/enum/user-role.enum';
import { ProfileResponse } from '../../../profile/web/response/profile.response';

export class UserResponse {
  public readonly id: string;
  public readonly roles: UserRoleEnum[];
  public readonly username?: string;
  public readonly mail?: string;
  public readonly profiles?: ProfileResponse[];
  public readonly stripeCustomerId?: string;
  public readonly fcmToken?: string;

  constructor(partial?: Partial<UserResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
