export class RemoveConnectedCardEvent {
  public readonly cardId: string;
  public readonly connectedCardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'remove-connected-card';

  constructor(partial: Partial<RemoveConnectedCardEvent>) {
    Object.assign(this, partial);
  }
}
