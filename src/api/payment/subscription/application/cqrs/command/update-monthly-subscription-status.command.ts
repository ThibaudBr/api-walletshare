export class UpdateMonthlySubscriptionStatusCommand {
  constructor(partial: Partial<UpdateMonthlySubscriptionStatusCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripCustomerId: string;
  public readonly subscriptionStatus: string;
}
