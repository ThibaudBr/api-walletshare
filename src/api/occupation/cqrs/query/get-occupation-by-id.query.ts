export class GetOccupationByIdQuery {
  constructor(partial: Partial<GetOccupationByIdQuery>) {
    Object.assign(partial);
  }

  public readonly occupationId: string;
}
