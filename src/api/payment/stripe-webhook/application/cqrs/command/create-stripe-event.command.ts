export class CreateStripeEventCommand {
  public readonly stripEventId: string;

  constructor(partial: Partial<CreateStripeEventCommand>) {
    Object.assign(this, partial);
  }
}
