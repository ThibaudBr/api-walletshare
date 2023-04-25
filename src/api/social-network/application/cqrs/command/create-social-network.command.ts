export class CreateSocialNetworkCommand {
  constructor(partial: Partial<CreateSocialNetworkCommand>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;
}
