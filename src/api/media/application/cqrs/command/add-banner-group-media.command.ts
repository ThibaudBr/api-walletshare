import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddBannerGroupMediaCommand {
  public readonly groupId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddBannerGroupMediaCommand>) {
    Object.assign(this, partial);
  }
}
