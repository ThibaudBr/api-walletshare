import {UserAccountStatusEnum} from "../../../../user/domain/enum/user-account-status.enum";

export class CreateProductRequest {
  public readonly name: string;
  public readonly description: string;
  public readonly userAccountStatus: UserAccountStatusEnum;

  constructor(partial: Partial<CreateProductRequest>) {
    Object.assign(this, partial);
  }
}
