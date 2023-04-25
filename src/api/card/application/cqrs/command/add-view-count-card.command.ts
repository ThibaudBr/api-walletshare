export class AddViewCountCardCommand {
  constructor(partial: Partial<AddViewCountCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
}
