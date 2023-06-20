export class GetCardPresetByCompanyIdQuery {
  public readonly companyId: string;

  constructor(partial: Partial<GetCardPresetByCompanyIdQuery>) {
    Object.assign(this, partial);
  }
}
