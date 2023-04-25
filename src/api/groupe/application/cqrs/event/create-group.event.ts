export class CreateGroupEvent {
  constructor(partial: Partial<CreateGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly cardId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'create-request';
}
