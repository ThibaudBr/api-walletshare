export class CreateStripeEventCommand {
  constructor(partial: Partial<CreateStripeEventCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripEventId: string;
}
