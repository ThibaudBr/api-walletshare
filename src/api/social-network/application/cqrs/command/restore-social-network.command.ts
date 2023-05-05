export class RestoreSocialNetworkCommand {
  public readonly id: string;

  constructor(partial: Partial<RestoreSocialNetworkCommand>) {
    Object.assign(this, partial);
  }
}
