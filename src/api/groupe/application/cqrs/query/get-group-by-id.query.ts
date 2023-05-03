export class GetGroupByIdQuery {
  public readonly groupId: string;

  constructor(partial: Partial<GetGroupByIdQuery>) {
    Object.assign(this, partial);
  }
}
