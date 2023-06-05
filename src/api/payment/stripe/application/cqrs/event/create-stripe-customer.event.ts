export class CreateStripeCustomerEvent {
  public readonly stripeCustomerId: string;
  public readonly handler: string;
  public readonly username: string;
  public readonly email: string;
  public readonly userId: string;
  public readonly module: string = 'stripe';
  public readonly methode: string = 'create-stripe-customer';

  constructor(partial: Partial<CreateStripeCustomerEvent>) {
    Object.assign(this, partial);
  }
}
