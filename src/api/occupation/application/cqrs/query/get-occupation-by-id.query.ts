export class GetOccupationByIdQuery {
  public readonly occupationId: string;

  constructor(partial: Partial<GetOccupationByIdQuery>) {
    Object.assign(this, partial);
  }
}
