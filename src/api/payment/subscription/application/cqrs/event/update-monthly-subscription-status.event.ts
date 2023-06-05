export class UpdateMonthlySubscriptionStatusEvent {
  public readonly stripCustomerId: string;
  public readonly subscriptionStatus: string;
  public readonly methode: string = 'update-monthly-subscription-status';
  public readonly module: string = 'payment';

  constructor(partial: Partial<UpdateMonthlySubscriptionStatusEvent>) {
    Object.assign(this, partial);
  }
}
