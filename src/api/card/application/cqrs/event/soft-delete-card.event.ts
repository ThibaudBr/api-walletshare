export class SoftDeleteCardEvent {
  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'soft-delete-card';

  constructor(partial: Partial<SoftDeleteCardEvent>) {
    Object.assign(this, partial);
  }
}
