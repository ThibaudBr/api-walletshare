export class GetAllCompanyQuery {
  public readonly deleted: boolean;
  public readonly take: number;
  public readonly skip: number;

  constructor(partial: Partial<GetAllCompanyQuery>) {
    Object.assign(this, partial);
  }
}
