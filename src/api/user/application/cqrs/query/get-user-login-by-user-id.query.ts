export class GetUserLoginByUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetUserLoginByUserIdQuery>) {
    Object.assign(this, partial);
  }
}
