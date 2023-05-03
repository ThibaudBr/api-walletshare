export class RemoveConnectedCardRequest {
  public readonly cardId: string;
  public readonly connectedCardId: string;

  constructor(partial: Partial<RemoveConnectedCardRequest>) {
    Object.assign(this, partial);
  }
}
