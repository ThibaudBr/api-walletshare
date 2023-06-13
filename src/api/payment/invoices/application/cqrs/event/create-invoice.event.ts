export class CreateInvoiceEvent {
  public readonly userId: string;
  public readonly subscriptionId: string;
  public readonly invoiceId: string;
  public readonly module: string = 'invoices';
  public readonly method: string = 'create-invoice';

  constructor(partial: Partial<CreateInvoiceEvent>) {
    Object.assign(this, partial);
  }
}
