export class CreateOccupationRequest {
  public readonly name: string;

  constructor(partial: Partial<CreateOccupationRequest>) {
    Object.assign(this, partial);
  }
}
