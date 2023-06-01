export class CreateStripeCustomerEvent {
  constructor(partial: Partial<CreateStripeCustomerEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly handler: string;
  public readonly username: string;
  public readonly email: string;
  public readonly userId: string;
  public readonly module: string = 'payment';
  public readonly methode: string = 'create-stripe-customer';
}
