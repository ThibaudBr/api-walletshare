export class ConstructEventFromPayloadStripeEvent {
  constructor(partial: Partial<ConstructEventFromPayloadStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly signature: string;
  public readonly module: string = 'payment';
  public readonly methode: string = 'construct-event-from-payload-stripe';
}
