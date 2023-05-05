export class GetSocialNetworkWithCriteriaRequest {
  public readonly isDeleted: boolean;
  public readonly name: string;

  constructor(partial: Partial<GetSocialNetworkWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}
