export class RestoreUserCommand {
  public readonly userId: string;

  constructor(partial: Partial<RestoreUserCommand>) {
    Object.assign(this, partial);
  }
}
