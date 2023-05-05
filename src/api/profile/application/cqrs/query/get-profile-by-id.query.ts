export class GetProfileByIdQuery {
  public readonly id: string;

  constructor(partial: Partial<GetProfileByIdQuery>) {
    Object.assign(this, partial);
  }
}
