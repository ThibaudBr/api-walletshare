export class UpdateOccupationRequest {
  public readonly name: string;

  constructor(partial: Partial<UpdateOccupationRequest>) {
    Object.assign(this, partial);
  }
}
