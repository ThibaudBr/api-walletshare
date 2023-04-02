export class UpdateOccupationRequest {
  constructor(partial: Partial<UpdateOccupationRequest>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
}
