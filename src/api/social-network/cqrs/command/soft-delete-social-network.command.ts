export class SoftDeleteSocialNetworkCommand {
  constructor(partial: Partial<SoftDeleteSocialNetworkCommand>) {
    Object.assign(partial);
  }

  public readonly id: string;
}
