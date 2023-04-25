export class GetOccupationByIdQuery {
  constructor(partial: Partial<GetOccupationByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;
}
