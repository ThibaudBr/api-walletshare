export class GetCompanyWithUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetCompanyWithUserIdQuery>) {
    Object.assign(this, partial);
  }
}
