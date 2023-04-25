export class CreateOccupationEvent {
  constructor(partial: Partial<CreateOccupationEvent>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;

  public readonly module: string = 'occupation';
  public readonly method: string = 'create-occupation';
}
