export class GetAllCardWithUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetAllCardWithUserIdQuery>) {
    Object.assign(this, partial);
  }
}
