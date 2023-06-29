import { MediaEntity } from '../../../media/domain/entities/media.entity';

export class CardPresetResponse {
  public readonly id: string;
  public readonly alignment: string;
  public readonly backgroundColor: string;
  public readonly media: MediaEntity;

  constructor(partial: Partial<CardPresetResponse>) {
    Object.assign(this, partial);
  }
}
