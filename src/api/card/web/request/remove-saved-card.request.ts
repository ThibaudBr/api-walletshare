export class RemoveSavedCardRequest {
  constructor(partial: Partial<RemoveSavedCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly profileId: string;
}
