export class SoftDeleteGroupEvent {
  constructor(partial: Partial<SoftDeleteGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'soft-delete-group';
}
