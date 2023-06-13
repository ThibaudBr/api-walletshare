export class GetUserByIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetUserByIdQuery>) {
    Object.assign(this, partial);
  }
}
