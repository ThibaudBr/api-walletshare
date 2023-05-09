export class GetUserLoginByUserIdQuery {
  constructor(partial: Partial<GetUserLoginByUserIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
