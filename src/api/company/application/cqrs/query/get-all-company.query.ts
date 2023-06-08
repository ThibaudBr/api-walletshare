export class GetAllCompanyQuery {
  constructor(partial: Partial<GetAllCompanyQuery>) {
    Object.assign(this, partial);
  }

  public readonly deleted: boolean;
  public readonly take: number;
  public readonly skip: number;
}
