export class AddSavedCardCommand {
  constructor(partial: Partial<AddSavedCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly cardId: string;
}
