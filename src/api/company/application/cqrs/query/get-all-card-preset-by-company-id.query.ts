export class GetAllCardPresetByCompanyIdQuery {
  constructor(partial: Partial<GetAllCardPresetByCompanyIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly companyId: string;
}
