import { UserAccountStatusEnum } from '../../../../../user/domain/enum/user-account-status.enum';

export class UpdateAccountStatusEvent {
  public readonly userId: string;
  public readonly status: UserAccountStatusEnum;
  public readonly method: string = 'update-account-status';
  public readonly module: string = 'subscription';

  constructor(partial: Partial<UpdateAccountStatusEvent>) {
    Object.assign(this, partial);
  }
}
