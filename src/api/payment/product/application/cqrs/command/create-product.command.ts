import {UserAccountStatusEnum} from "../../../../../user/domain/enum/user-account-status.enum";

export class CreateProductCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly stripeProductId: string;
  public readonly jsonStripeMetadata: object;
  public readonly userAccountStatus: UserAccountStatusEnum;

  constructor(partial: Partial<CreateProductCommand>) {
    Object.assign(this, partial);
  }
}
