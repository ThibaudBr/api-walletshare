export class GetSavedCardWithProfileIdQuery {
  constructor(partial: Partial<GetSavedCardWithProfileIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
}
