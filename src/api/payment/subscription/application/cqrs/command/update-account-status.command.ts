import { UserAccountStatusEnum } from '../../../../../user/domain/enum/user-account-status.enum';

export class UpdateAccountStatusCommand {
  public readonly userId: string;
  public readonly status: UserAccountStatusEnum;

  constructor(partial: Partial<UpdateAccountStatusCommand>) {
    Object.assign(this, partial);
  }
}
