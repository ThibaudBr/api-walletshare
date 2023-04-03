export class AddViewCountCardEvent {
  constructor(partial: Partial<AddViewCountCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;

  public readonly module: string = 'card';
  public readonly method: string = 'add-view-count';
}
