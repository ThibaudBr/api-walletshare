export class ConstructEventFromPayloadStripeCommand {
  public readonly payload: Buffer;
  public readonly signature: string;

  constructor(partial: Partial<ConstructEventFromPayloadStripeCommand>) {
    Object.assign(this, partial);
  }
}
