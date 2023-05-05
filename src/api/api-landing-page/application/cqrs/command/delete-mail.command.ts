export class DeleteMailCommand {
  public readonly mail: string;

  constructor(partial: Partial<DeleteMailCommand>) {
    Object.assign(this, partial);
  }
}
