export class SaveUserLoginResponse {
  constructor(partial: Partial<SaveUserLoginResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly userId: string;
  public readonly os?: string;
  public readonly device?: string;
  public readonly ip?: string;
  public readonly platform?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}
