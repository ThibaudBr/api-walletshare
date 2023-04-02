export class GetAllOccupationQuery {
  constructor(partial: Partial<GetAllOccupationQuery>) {
    Object.assign(partial);
  }

  public readonly module: string = 'occupation';
  public readonly method: string = 'get-all-occupation';
}
