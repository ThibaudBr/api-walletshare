export class GetAllOccupationQuery {
  constructor(partial: Partial<GetAllOccupationQuery>) {
    Object.assign(this, partial);
  }

  public readonly module: string = 'occupation';
  public readonly method: string = 'get-all-occupation';
}
