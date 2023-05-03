export class GetSocialNetworkWithCriteriaQuery {
  public readonly isDeleted: boolean = false;
  public readonly name?: string;

  constructor(partial: Partial<GetSocialNetworkWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
}
