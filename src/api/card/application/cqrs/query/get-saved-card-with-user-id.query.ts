export class GetSavedCardWithUserIdQuery {
  constructor(partial: Partial<GetSavedCardWithUserIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
