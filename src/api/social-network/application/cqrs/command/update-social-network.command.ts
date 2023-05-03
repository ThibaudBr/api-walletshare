export class UpdateSocialNetworkCommand {
  public readonly id: string;
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;

  constructor(partial: Partial<UpdateSocialNetworkCommand>) {
    Object.assign(this, partial);
  }
}
