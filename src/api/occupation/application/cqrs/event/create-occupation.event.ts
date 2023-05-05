export class CreateOccupationEvent {
  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'create-occupation';

  constructor(partial: Partial<CreateOccupationEvent>) {
    Object.assign(this, partial);
  }
}
