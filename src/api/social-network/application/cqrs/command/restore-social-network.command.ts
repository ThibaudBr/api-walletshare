export class RestoreSocialNetworkCommand {
  constructor(partial: Partial<RestoreSocialNetworkCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}
