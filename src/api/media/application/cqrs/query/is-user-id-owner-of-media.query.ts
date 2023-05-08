export class IsUserIdOwnerOfMediaQuery {
  public readonly userId: string;
  public readonly mediaId: string;

  constructor(partial: Partial<IsUserIdOwnerOfMediaQuery>) {
    Object.assign(this, partial);
  }
}
