export class RemoveConnectedCardEvent {
  constructor(partial: Partial<RemoveConnectedCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly connectedCardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'remove-connected-card';
}
