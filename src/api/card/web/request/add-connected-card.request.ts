export class AddConnectedCardRequest {
  public readonly cardId: string;
  public readonly connectedCardId: string;

  constructor(partial: Partial<AddConnectedCardRequest>) {
    Object.assign(this, partial);
  }
}
