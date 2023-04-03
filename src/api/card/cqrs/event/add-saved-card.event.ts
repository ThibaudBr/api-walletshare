export class AddSavedCardEvent {
  constructor(partial: Partial<AddSavedCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly cardId: string;
  public readonly method: string = 'add-saved-card-handler';
  public readonly module: string = 'card';
}
