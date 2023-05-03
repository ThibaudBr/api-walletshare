export class GetSavedCardWithUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetSavedCardWithUserIdQuery>) {
    Object.assign(this, partial);
  }
}
