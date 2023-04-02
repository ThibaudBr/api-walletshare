export class DeleteSocialNetworkCommand {
  constructor(partial: Partial<DeleteSocialNetworkCommand>) {
    Object.assign(partial);
  }

  public readonly id: string;
}
