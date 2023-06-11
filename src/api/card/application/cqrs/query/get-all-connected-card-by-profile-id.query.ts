export class GetAllConnectedCardByProfileIdQuery {
  constructor(partial: Partial<GetAllConnectedCardByProfileIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
}
