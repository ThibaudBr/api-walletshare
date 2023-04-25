export class AddConnectedCardEvent {
  constructor(partial: Partial<AddConnectedCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly connectedCardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'add-connected-card';
}
