export class IsUserIdOwnerOfMessageQuery {
  public readonly userId: string;
  public readonly messageId: string;

  constructor(partial: Partial<IsUserIdOwnerOfMessageQuery>) {
    Object.assign(this, partial);
  }
}
