export class GetAllOccupationQuery {
  public readonly module: string = 'occupation';
  public readonly method: string = 'get-all-occupation';

  constructor(partial: Partial<GetAllOccupationQuery>) {
    Object.assign(this, partial);
  }
}
