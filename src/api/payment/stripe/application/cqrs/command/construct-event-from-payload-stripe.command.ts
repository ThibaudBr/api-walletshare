import { StripeWebhookSignatureEnum } from '../../../../stripe-webhook/domain/enum/stripe-webhook-signature.enum';

export class ConstructEventFromPayloadStripeCommand {
  public readonly payload: Buffer;
  public readonly signature: string;
  public readonly stripeWebhookSignatureEnum: StripeWebhookSignatureEnum;

  constructor(partial: Partial<ConstructEventFromPayloadStripeCommand>) {
    Object.assign(this, partial);
  }
}
