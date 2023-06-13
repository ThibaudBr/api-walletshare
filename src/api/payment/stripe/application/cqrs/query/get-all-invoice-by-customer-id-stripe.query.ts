export class GetAllInvoiceByCustomerIdStripeQuery {
  public readonly customerId: string;

  constructor(partial: Partial<GetAllInvoiceByCustomerIdStripeQuery>) {
    Object.assign(this, partial);
  }
}
