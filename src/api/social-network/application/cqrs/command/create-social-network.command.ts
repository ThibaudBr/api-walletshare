export class CreateSocialNetworkCommand {
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;

  constructor(partial: Partial<CreateSocialNetworkCommand>) {
    Object.assign(this, partial);
  }
}
