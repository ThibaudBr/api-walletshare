export class ProfileResponse {
  public readonly id: string;
  public readonly userId?: string;
  public readonly usernameProfile: string;

  public readonly isDeleted?: boolean;

  public readonly roleProfile?: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}
