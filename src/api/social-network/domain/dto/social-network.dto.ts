export class SocialNetworkDto {
  constructor(partial: Partial<SocialNetworkDto>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly url: string;
  public readonly icon: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}
