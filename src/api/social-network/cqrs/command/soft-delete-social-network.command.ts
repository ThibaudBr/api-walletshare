export class SoftDeleteSocialNetworkCommand {
  constructor(partial: Partial<SoftDeleteSocialNetworkCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}
