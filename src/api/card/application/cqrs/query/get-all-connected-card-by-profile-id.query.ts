export class GetAllConnectedCardByProfileIdQuery {
  public readonly profileId: string;

  constructor(partial: Partial<GetAllConnectedCardByProfileIdQuery>) {
    Object.assign(this, partial);
  }
}
