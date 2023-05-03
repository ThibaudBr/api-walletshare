export class DeleteCardCommand {
  public readonly id: string;

  constructor(partial: Partial<DeleteCardCommand>) {
    Object.assign(this, partial);
  }
}
