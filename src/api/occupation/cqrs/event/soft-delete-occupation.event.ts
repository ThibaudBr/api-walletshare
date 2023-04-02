export class SoftDeleteOccupationEvent {
  constructor(partial: Partial<SoftDeleteOccupationEvent>) {
    Object.assign(partial);
  }

  public readonly occupationId: string;
  public readonly module: string = 'occupation';
  public readonly method: string = 'soft-delete-occupation';
}
