export class AddConnectedCardRequest {
  constructor(partial: Partial<AddConnectedCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly connectedCardId: string;
}
