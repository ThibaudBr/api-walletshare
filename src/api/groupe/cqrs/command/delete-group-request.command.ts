export class DeleteGroupRequestCommand {
  constructor(partial: Partial<DeleteGroupRequestCommand>) {
    Object.assign(this, partial);
  }

  public readonly groupRequestId: string;
}
