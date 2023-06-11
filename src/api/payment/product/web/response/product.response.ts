import { PriceResponse } from '../../../price/web/response/price.response';
import {UserRoleEnum} from "../../../../user/domain/enum/user-role.enum";
import {UserAccountStatusEnum} from "../../../../user/domain/enum/user-account-status.enum";
import {RoleProfileEnum} from "../../../../profile/domain/enum/role-profile.enum";

export class ProductResponse {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly stripeProductId: string;
  public readonly jsonStripeMetadata: object;
  public readonly active: boolean;
  public readonly prices: PriceResponse[];
  public readonly userRoleToGive: UserRoleEnum;
  public readonly profileRoleToGive: RoleProfileEnum;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<ProductResponse>) {
    Object.assign(this, partial);
  }
}
