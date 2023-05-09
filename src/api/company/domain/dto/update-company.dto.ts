export class UpdateCompanyDto {
  public readonly name?: string;
  public readonly siret?: string;
  public readonly description?: string;
  public readonly banner_url?: string;
  public readonly address?: string;
  public readonly phone?: string;
  public readonly email?: string;

  constructor(partial: Partial<UpdateCompanyDto>) {
    Object.assign(this, partial);
  }
}
