export class AddSavedCardRequest {
  constructor(partial: Partial<AddSavedCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly profileId: string;
}
