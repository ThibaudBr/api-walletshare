export class SoftDeleteOccupationEvent {
  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'soft-delete-occupation';

  constructor(partial: Partial<SoftDeleteOccupationEvent>) {
    Object.assign(this, partial);
  }
}
