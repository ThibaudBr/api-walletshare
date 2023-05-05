export class DeleteProfileCommand {
  public readonly id: string;

  constructor(partial: Partial<DeleteProfileCommand>) {
    Object.assign(this, partial);
  }
}
