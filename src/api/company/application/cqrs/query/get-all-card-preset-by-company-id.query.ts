export class GetAllCardPresetByCompanyIdQuery {
  public readonly companyId: string;

  constructor(partial: Partial<GetAllCardPresetByCompanyIdQuery>) {
    Object.assign(this, partial);
  }
}
