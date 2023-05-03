export class SoftDeleteSocialNetworkCommand {
  public readonly id: string;

  constructor(partial: Partial<SoftDeleteSocialNetworkCommand>) {
    Object.assign(this, partial);
  }
}
