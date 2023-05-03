export class RemoveSavedCardEvent {
  public readonly profileId: string;
  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'remove-saved-card-handler';

  constructor(partial: Partial<RemoveSavedCardEvent>) {
    Object.assign(this, partial);
  }
}
