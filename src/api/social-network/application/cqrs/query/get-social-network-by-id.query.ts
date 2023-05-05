export class GetSocialNetworkByIdQuery {
  public readonly id: string;

  constructor(partial: Partial<GetSocialNetworkByIdQuery>) {
    Object.assign(this, partial);
  }
}
