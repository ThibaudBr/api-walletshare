export class GetAllProductRequest {
  public readonly offset: number;
  public readonly limit: number;

  constructor(partial: Partial<GetAllProductRequest>) {
    Object.assign(this, partial);
  }
}
