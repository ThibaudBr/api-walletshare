export class ConstructEventFromPayloadStripeCommand {
  constructor(partial: Partial<ConstructEventFromPayloadStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly payload: Buffer;
  public readonly signature: string;
}
