export class UpdateMonthlySubscriptionStatusCommand {
  public readonly stripCustomerId: string;
  public readonly subscriptionStatus: string;

  constructor(partial: Partial<UpdateMonthlySubscriptionStatusCommand>) {
    Object.assign(this, partial);
  }
}
