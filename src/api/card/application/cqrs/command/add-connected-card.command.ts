export class AddConnectedCardCommand {
  public readonly cardId: string;
  public readonly connectedCardId: string;

  constructor(partial: Partial<AddConnectedCardCommand>) {
    Object.assign(this, partial);
  }
}
