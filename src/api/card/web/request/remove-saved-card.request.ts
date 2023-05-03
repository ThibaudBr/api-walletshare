export class RemoveSavedCardRequest {
  public readonly cardId: string;
  public readonly profileId: string;

  constructor(partial: Partial<RemoveSavedCardRequest>) {
    Object.assign(this, partial);
  }
}
