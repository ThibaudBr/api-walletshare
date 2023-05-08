import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddBannerProfileMediaCommand {
  public readonly profileId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddBannerProfileMediaCommand>) {
    Object.assign(this, partial);
  }
}
