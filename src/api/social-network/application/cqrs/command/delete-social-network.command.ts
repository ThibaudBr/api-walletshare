export class DeleteSocialNetworkCommand {
  public readonly id: string;

  constructor(partial: Partial<DeleteSocialNetworkCommand>) {
    Object.assign(this, partial);
  }
}
