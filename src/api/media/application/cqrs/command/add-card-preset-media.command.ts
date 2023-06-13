import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddCardPresetMediaCommand {
  public readonly cardPresetId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddCardPresetMediaCommand>) {
    Object.assign(this, partial);
  }
}
