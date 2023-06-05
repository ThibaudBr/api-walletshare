export class GetListSavedCreditCardOfUserQuery {
  public readonly stripeCustomerId: string;

  constructor(partial: Partial<GetListSavedCreditCardOfUserQuery>) {
    Object.assign(this, partial);
  }
}
