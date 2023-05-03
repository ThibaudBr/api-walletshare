export class RestoreCardEvent {
  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'restore-card';

  constructor(partial: Partial<RestoreCardEvent>) {
    Object.assign(this, partial);
  }
}
