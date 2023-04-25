export class GetProfilesByUserIdQuery {
  public readonly id: string;
  constructor(partial: Partial<GetProfilesByUserIdQuery>) {
    Object.assign(this, partial);
  }
}
