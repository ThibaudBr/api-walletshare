export class GetCompanyEmployeeByOwnerUserIdQuery {
  public readonly userId: string;

  constructor(partial?: Partial<GetCompanyEmployeeByOwnerUserIdQuery>) {
    Object.assign(this, partial);
  }
}
