export class AddViewCountCardCommand {
  public readonly cardId: string;

  constructor(partial: Partial<AddViewCountCardCommand>) {
    Object.assign(this, partial);
  }
}
