export class GetCompanyWithProfileIdQuery {
  public readonly profileId: string;

  constructor(partial: Partial<GetCompanyWithProfileIdQuery>) {
    Object.assign(this, partial);
  }
}
