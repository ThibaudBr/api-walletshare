export class GetCompanyPresetByOwnerUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetCompanyPresetByOwnerUserIdQuery>) {
    Object.assign(this, partial);
  }
}
