export class UpdateOccupationEvent {
  constructor(partial: Partial<UpdateOccupationEvent>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'update-occupation';
}
