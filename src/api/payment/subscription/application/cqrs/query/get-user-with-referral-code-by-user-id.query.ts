export class GetUserWithReferralCodeByUserIdQuery {
  constructor(partial: Partial<GetUserWithReferralCodeByUserIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
