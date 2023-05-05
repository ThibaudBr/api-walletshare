export class UpdateOccupationEvent {
  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'update-occupation';

  constructor(partial: Partial<UpdateOccupationEvent>) {
    Object.assign(this, partial);
  }
}
