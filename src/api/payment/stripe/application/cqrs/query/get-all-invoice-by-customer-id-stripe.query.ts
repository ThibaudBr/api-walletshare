export class GetAllInvoiceByCustomerIdStripeQuery {
  constructor(partial: Partial<GetAllInvoiceByCustomerIdStripeQuery>) {
    Object.assign(this, partial);
  }

  public readonly customerId: string;
}
