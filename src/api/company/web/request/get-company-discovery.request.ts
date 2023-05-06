export class GetCompanyDiscoveryRequest {
  public readonly userX?: string;
  public readonly userY?: string;
  public readonly distance?: number;
  public readonly occupationIdList: string[];

  constructor(partial: Partial<GetCompanyDiscoveryRequest>) {
    Object.assign(this, partial);
  }
}
