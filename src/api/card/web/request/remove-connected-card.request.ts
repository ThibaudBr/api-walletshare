export class RemoveConnectedCardRequest {
  constructor(partial: Partial<RemoveConnectedCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly connectedCardId: string;
}
