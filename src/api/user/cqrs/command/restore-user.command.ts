export class RestoreUserCommand {
  public readonly id: string;

  constructor(partial: Partial<RestoreUserCommand>) {
    Object.assign(this, partial);
  }
}
