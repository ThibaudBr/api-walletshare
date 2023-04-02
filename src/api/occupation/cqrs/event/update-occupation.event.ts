export class UpdateOccupationEvent {
  constructor(partial: Partial<UpdateOccupationEvent>) {
    Object.assign(partial);
  }

  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'update-occupation';
}
