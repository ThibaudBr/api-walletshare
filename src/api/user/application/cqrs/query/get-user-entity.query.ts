export class GetUserEntityQuery {
  constructor(partial: Partial<GetUserEntityQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
