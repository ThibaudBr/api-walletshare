export class GetCardWithCriteriaRequest {
  constructor(partial: Partial<GetCardWithCriteriaRequest>) {
    Object.assign(this, partial);
  }

  public readonly isDeleted?: boolean = false;

  public readonly cardType?: string;
}
