export class CreateGroupEvent {
  public readonly groupId: string;
  public readonly cardId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'create-request';

  constructor(partial: Partial<CreateGroupEvent>) {
    Object.assign(this, partial);
  }
}
