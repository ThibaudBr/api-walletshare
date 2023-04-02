export class GetSocialNetworkByIdQuery {
  constructor(partial: Partial<GetSocialNetworkByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}
