export class GetSocialNetworkWithCriteriaRequest {
  constructor(partial: Partial<GetSocialNetworkWithCriteriaRequest>) {
    Object.assign(this, partial);
  }

  public readonly isDeleted: boolean;
  public readonly name: string;
}
