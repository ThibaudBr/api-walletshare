export class GetAllCardWithUserIdQuery {
  constructor(partial: Partial<GetAllCardWithUserIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}
