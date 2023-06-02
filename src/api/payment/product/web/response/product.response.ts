import {PriceResponse} from "../../../price/web/response/price.response";

export class ProductResponse {
  constructor(partial: Partial<ProductResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly stripeProductId: string;
  public readonly jsonStripeMetadata: object;
  public readonly active: boolean;
  public readonly prices: PriceResponse[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}
