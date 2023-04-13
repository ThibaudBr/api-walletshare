export class DeleteOccupationEvent {
  constructor(partial: Partial<DeleteOccupationEvent>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'delete-occupation';
}
