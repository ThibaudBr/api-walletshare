export class ConstructEventFromPayloadStripeEvent {
  public readonly signature: string;
  public readonly module: string = 'stripe';
  public readonly methode: string = 'construct-event-from-payload-stripe';

  constructor(partial: Partial<ConstructEventFromPayloadStripeEvent>) {
    Object.assign(this, partial);
  }
}
