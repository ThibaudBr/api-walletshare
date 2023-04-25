export class DeleteMailCommand {
  constructor(partial: Partial<DeleteMailCommand>) {
    Object.assign(this, partial);
  }

  public readonly mail: string;
}
