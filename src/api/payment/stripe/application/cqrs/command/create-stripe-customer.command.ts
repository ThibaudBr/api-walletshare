export class CreateStripeCustomerCommand {
  public readonly userId: string;
  public username: string;
  public email: string;

  constructor(partial: Partial<CreateStripeCustomerCommand>) {
    Object.assign(this, partial);
  }
}
