export class GetUserAndProfileFromSocketQuery {
  constructor(partial?: Partial<GetUserAndProfileFromSocketQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly socketId: string;
}
