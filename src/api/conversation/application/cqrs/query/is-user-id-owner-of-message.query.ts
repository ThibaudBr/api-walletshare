export class IsUserIdOwnerOfMessageQuery {
  constructor(partial: Partial<IsUserIdOwnerOfMessageQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly messageId: string;
}
