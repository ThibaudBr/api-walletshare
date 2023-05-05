export class DeleteOccupationCommand {
  public readonly occupationId: string;

  constructor(partial: Partial<DeleteOccupationCommand>) {
    Object.assign(this, partial);
  }
}
