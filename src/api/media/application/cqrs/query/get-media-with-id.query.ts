export class GetMediaWithIdQuery {
  public readonly mediaId: string;

  constructor(partial: Partial<GetMediaWithIdQuery>) {
    Object.assign(this, partial);
  }
}
