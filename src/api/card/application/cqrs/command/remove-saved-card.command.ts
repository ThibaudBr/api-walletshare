export class RemoveSavedCardCommand {
  public readonly profileId: string;
  public readonly cardId: string;

  constructor(partial: Partial<RemoveSavedCardCommand>) {
    Object.assign(this, partial);
  }
}
