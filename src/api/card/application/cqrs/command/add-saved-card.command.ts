export class AddSavedCardCommand {
  public readonly profileId: string;
  public readonly cardId: string;

  constructor(partial: Partial<AddSavedCardCommand>) {
    Object.assign(this, partial);
  }
}
