export class UpdateCardEvent {
  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'update-card';

  constructor(partial: Partial<UpdateCardEvent>) {
    Object.assign(this, partial);
  }
}
