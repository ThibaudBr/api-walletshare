export class CreateStripeCustomerCommand {
  constructor(partial: Partial<CreateStripeCustomerCommand>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public username: string;
  public email: string;
}
