export class ReferralCodeResponse {
  public readonly id: string;
  public readonly referralCodeString: string;
  public readonly stripeId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial?: Partial<ReferralCodeResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
