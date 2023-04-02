export class UpdateSocialNetworkRequest {
  constructor(partial: Partial<UpdateSocialNetworkRequest>) {
    Object.assign(partial);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;
}
