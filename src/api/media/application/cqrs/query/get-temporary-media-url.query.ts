export class GetTemporaryMediaUrlQuery {
  public readonly mediaKey: string;

  constructor(partial: Partial<GetTemporaryMediaUrlQuery>) {
    Object.assign(this, partial);
  }
}
