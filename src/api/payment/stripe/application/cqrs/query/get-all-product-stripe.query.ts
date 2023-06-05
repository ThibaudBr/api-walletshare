export class GetAllProductStripeQuery {
  public readonly limit: number = 10;
  public readonly offset: string = '0';

  constructor(partial: Partial<GetAllProductStripeQuery>) {
    Object.assign(this, partial);
  }
}
