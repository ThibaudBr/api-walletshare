export class IsCardOwnerWithUserIdQuery {
  constructor(partial: Partial<IsCardOwnerWithUserIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly userId: string;
}
