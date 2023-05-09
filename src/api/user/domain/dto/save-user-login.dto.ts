export class SaveUserLoginDto {
  constructor(partial: Partial<SaveUserLoginDto>) {
    Object.assign(this, partial);
  }

  public readonly os?: string;
  public readonly device?: string;
  public readonly ip?: string;
  public readonly userId: string;
  public readonly platform?: string;
}
