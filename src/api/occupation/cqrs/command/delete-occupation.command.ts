export class DeleteOccupationCommand {
  constructor(partial: Partial<DeleteOccupationCommand>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;
}
