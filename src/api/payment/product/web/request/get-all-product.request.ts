export class GetAllProductRequest {
  constructor(partial: Partial<GetAllProductRequest>) {
    Object.assign(this, partial);
  }

  public readonly offset: number;
  public readonly limit: number;
}
