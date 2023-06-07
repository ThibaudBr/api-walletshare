export class StripeEventTypeEnum {
  PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded';
  PAYMENT_INTENT_PAYMENT_FAILED = 'payment_intent.payment_failed';
  INVOICE_CREATED = 'invoice.created';
  INVOICE_FINALIZATION_ATTEMPT_FAILED = 'invoice.finalization_failed';
  INVOICE_PAYMENT_SUCCEEDED = 'invoice.payment_succeeded';
  INVOICE_FINALIZED = 'invoice.finalized';
  INVOICE_MARKED_UNCOLLECTIBLE = 'invoice.marked_uncollectible';
  INVOICE_VOIDED = 'invoice.voided';
  INVOICE_PAID = 'invoice.paid';
  CHARGE_SUCCEEDED = 'charge.succeeded';
  CHARGE_FAILED = 'charge.failed';
  CHARGE_REFUND = 'charge.refund';
}
