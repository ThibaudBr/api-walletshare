export class AddViewCountCardEvent {
  public readonly cardId: string;
  public readonly cardView: string;
  public readonly cardViewCount: number;
  public readonly module: string = 'card';
  public readonly method: string = 'add-view-count';

  constructor(partial: Partial<AddViewCountCardEvent>) {
    Object.assign(this, partial);
  }
}
