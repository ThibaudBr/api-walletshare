export class GetCompanyEmployeeByOwnerUserIdForChartQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetCompanyEmployeeByOwnerUserIdForChartQuery>) {
    Object.assign(this, partial);
  }
}
