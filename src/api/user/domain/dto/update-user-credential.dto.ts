export class UpdateUserCredentialDto {
  public readonly username: string;
  public readonly password: string;

  public readonly newPassword: string;

  constructor(partial: Partial<UpdateUserCredentialDto>) {
    Object.assign(this, partial);
  }
}
