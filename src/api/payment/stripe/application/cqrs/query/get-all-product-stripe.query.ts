export class GetAllProductStripeQuery {
  constructor(partial: Partial<GetAllProductStripeQuery>) {
    Object.assign(this, partial);
  }

  public readonly limit: number = 10;
  public readonly offset: string = '0';
}
