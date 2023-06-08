import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddCardPresetMediaCommand {
  constructor(partial: Partial<AddCardPresetMediaCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardPresetId: string;
  public readonly mediaEntity: MediaEntity;
}
