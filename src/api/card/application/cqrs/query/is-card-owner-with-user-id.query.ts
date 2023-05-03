export class IsCardOwnerWithUserIdQuery {
  public readonly cardId: string;
  public readonly userId: string;

  constructor(partial: Partial<IsCardOwnerWithUserIdQuery>) {
    Object.assign(this, partial);
  }
}
