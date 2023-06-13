export class GetUserWithReferralCodeByUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetUserWithReferralCodeByUserIdQuery>) {
    Object.assign(this, partial);
  }
}
