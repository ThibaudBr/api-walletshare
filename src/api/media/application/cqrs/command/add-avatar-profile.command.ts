import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddAvatarProfileCommand {
  constructor(partial: Partial<AddAvatarProfileCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  mediaEntity: MediaEntity;
}
