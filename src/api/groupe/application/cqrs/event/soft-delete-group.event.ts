export class SoftDeleteGroupEvent {
  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'soft-delete-group';

  constructor(partial: Partial<SoftDeleteGroupEvent>) {
    Object.assign(this, partial);
  }
}
