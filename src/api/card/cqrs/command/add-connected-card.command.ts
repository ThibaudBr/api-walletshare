export class AddConnectedCardCommand {
  constructor(partial: Partial<AddConnectedCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly connectedCardId: string;
}
