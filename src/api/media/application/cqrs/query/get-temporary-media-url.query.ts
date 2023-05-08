export class GetTemporaryMediaUrlQuery {
  constructor(partial: Partial<GetTemporaryMediaUrlQuery>) {
    Object.assign(this, partial);
  }

  public readonly mediaKey: string;
}
