export class GetAllCardWithProfileIdQuery {
  public readonly profileId: string;
  public readonly withDeleted: boolean = false;

  constructor(partial: Partial<GetAllCardWithProfileIdQuery>) {
    Object.assign(this, partial);
  }
}
