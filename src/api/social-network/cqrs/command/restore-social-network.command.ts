export class RestoreSocialNetworkCommand {
  constructor(partial: Partial<RestoreSocialNetworkCommand>) {
    Object.assign(partial);
  }

  public readonly id: string;
}
