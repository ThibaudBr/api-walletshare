export class GetAllConnectedCardByUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetAllConnectedCardByUserIdQuery>) {
    Object.assign(this, partial);
  }
}
