export class IsUserIdOwnerOfMediaQuery {
  constructor(partial: Partial<IsUserIdOwnerOfMediaQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly mediaId: string;
}
