export class GetAllCardWithProfileIdQuery {
  constructor(partial: Partial<GetAllCardWithProfileIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly withDeleted: boolean = false;
}
