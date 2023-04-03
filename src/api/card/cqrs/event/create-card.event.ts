export class CreateCardEvent {
  constructor(partial: Partial<CreateCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly profileId: string;
  public readonly module: string = 'card';
  public readonly method: string = 'create-card';
}
