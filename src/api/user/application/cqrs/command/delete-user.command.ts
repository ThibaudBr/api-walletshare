export class DeleteUserCommand {
  public readonly userId: string;

  constructor(partial: Partial<DeleteUserCommand>) {
    Object.assign(this, partial);
  }
}
