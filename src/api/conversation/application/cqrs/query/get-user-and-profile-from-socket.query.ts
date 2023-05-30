export class GetUserAndProfileFromSocketQuery {
  public readonly socketId: string;

  constructor(partial?: Partial<GetUserAndProfileFromSocketQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
