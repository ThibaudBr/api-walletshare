export class UpdateCardEvent {
  constructor(partial: Partial<UpdateCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'update-card';
}
