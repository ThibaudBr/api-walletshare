export class SoftDeleteCardEvent {
  constructor(partial: Partial<SoftDeleteCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'soft-delete-card';
}
