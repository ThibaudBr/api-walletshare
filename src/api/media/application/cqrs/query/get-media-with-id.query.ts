export class GetMediaWithIdQuery {
  constructor(partial: Partial<GetMediaWithIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
}
