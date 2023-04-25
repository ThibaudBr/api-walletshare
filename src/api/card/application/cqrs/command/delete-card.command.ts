export class DeleteCardCommand {
  constructor(partial: Partial<DeleteCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}
