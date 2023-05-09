export class AddCardMediaEvent {
  public readonly cardId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-card-media';

  constructor(partial: Partial<AddCardMediaEvent>) {
    Object.assign(this, partial);
  }
}
