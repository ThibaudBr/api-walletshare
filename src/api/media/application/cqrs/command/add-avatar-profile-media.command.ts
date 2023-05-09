import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddAvatarProfileMediaCommand {
  public readonly profileId: string;
  mediaEntity: MediaEntity;

  constructor(partial: Partial<AddAvatarProfileMediaCommand>) {
    Object.assign(this, partial);
  }
}
