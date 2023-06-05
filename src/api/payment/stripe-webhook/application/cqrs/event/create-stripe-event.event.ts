export class CreateStripeEventEvent {
  public readonly stripEventId: string;
  public readonly module: string = 'payment';
  public readonly method: string = 'create-stripe-event';

  constructor(partial: Partial<CreateStripeEventEvent>) {
    Object.assign(this, partial);
  }
}
