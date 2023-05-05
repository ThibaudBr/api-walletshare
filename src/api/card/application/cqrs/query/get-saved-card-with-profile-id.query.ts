export class GetSavedCardWithProfileIdQuery {
  public readonly profileId: string;

  constructor(partial: Partial<GetSavedCardWithProfileIdQuery>) {
    Object.assign(this, partial);
  }
}
