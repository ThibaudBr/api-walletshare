export class GetCompanyDiscoveryQuery {
  public readonly userX?: string;
  public readonly userY?: string;
  public readonly distance?: number;
  public readonly occupationIdList: string[];

  constructor(partial: Partial<GetCompanyDiscoveryQuery>) {
    Object.assign(this, partial);
  }
}
