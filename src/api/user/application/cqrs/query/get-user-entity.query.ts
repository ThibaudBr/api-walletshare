export class GetUserEntityQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetUserEntityQuery>) {
    Object.assign(this, partial);
  }
}
