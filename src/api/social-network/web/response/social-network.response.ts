export class SocialNetworkResponse {
  public readonly id: string;
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly color: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<SocialNetworkResponse>) {
    Object.assign(this, partial);
  }
}
