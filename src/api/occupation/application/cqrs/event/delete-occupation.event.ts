export class DeleteOccupationEvent {
  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'delete-occupation';

  constructor(partial: Partial<DeleteOccupationEvent>) {
    Object.assign(this, partial);
  }
}
