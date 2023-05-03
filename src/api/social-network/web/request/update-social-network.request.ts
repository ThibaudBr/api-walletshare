export class UpdateSocialNetworkRequest {
  public readonly id: string;
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;

  constructor(partial: Partial<UpdateSocialNetworkRequest>) {
    Object.assign(this, partial);
  }
}
