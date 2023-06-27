export class GetListMySubscriptionQuery {
  constructor(partial: Partial<GetListMySubscriptionQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
