export class DeleteCardEvent {
  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'delete-card';

  constructor(partial: Partial<DeleteCardEvent>) {
    Object.assign(this, partial);
  }
}
