import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddCardMediaCommand {
  public readonly cardId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddCardMediaCommand>) {
    Object.assign(this, partial);
  }
}
