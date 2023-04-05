export class GetGroupByIdQuery {
  constructor(partial: Partial<GetGroupByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
}
