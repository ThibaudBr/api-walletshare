export class AddMessageWithMediaEvent {
  public readonly content: string;
  public readonly conversationId: string;
  public readonly cardId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-message-with-media';

  constructor(partial: Partial<AddMessageWithMediaEvent>) {
    Object.assign(this, partial);
  }
}
