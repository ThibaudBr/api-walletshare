export class GetListSavedCreditCardOfUserQuery {
  constructor(partial: Partial<GetListSavedCreditCardOfUserQuery>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
}
