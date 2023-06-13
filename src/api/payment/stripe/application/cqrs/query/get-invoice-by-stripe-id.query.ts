export class GetInvoiceByStripeIdQuery {
  constructor(partial: Partial<GetInvoiceByStripeIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly stripeInvoiceId: string;
}
