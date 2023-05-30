import { MediaEntity } from '../../../../media/domain/entities/media.entity';

export class AddMessageWithMediaCommand {
  public readonly content: string;
  public readonly conversationId: string;
  public readonly cardId: string;
  public readonly media: MediaEntity;

  constructor(partial: Partial<AddMessageWithMediaCommand>) {
    Object.assign(this, partial);
  }
}
