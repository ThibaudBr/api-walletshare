export class CreateSocialNetworkRequest {
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;

  constructor(partial: Partial<CreateSocialNetworkRequest>) {
    Object.assign(this, partial);
  }
}
