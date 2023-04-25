export class DeleteSocialNetworkCommand {
  constructor(partial: Partial<DeleteSocialNetworkCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}
