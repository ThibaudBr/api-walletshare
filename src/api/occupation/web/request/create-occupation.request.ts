export class CreateOccupationRequest {
  constructor(partial: Partial<CreateOccupationRequest>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
}
