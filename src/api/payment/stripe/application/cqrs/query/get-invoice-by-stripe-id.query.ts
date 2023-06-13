export class GetInvoiceByStripeIdQuery {
  public readonly stripeInvoiceId: string;

  constructor(partial: Partial<GetInvoiceByStripeIdQuery>) {
    Object.assign(this, partial);
  }
}
