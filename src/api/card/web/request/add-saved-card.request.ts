export class AddSavedCardRequest {
  public readonly cardId: string;
  public readonly profileId: string;

  constructor(partial: Partial<AddSavedCardRequest>) {
    Object.assign(this, partial);
  }
}
