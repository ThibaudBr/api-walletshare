export class DeleteOccupationCommand {
  constructor(partial: Partial<DeleteOccupationCommand>) {
    Object.assign(partial);
  }

  public readonly occupationId: string;
}
