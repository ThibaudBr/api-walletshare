export class RemoveSavedCardCommand {
  constructor(partial: Partial<RemoveSavedCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly cardId: string;
}
