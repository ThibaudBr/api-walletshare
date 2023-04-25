export class RemoveSavedCardEvent {
  constructor(partial: Partial<RemoveSavedCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly cardId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'remove-saved-card-handler';
}
