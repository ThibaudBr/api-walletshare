import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddAvatarGroupMediaCommand {
  public readonly groupId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddAvatarGroupMediaCommand>) {
    Object.assign(this, partial);
  }
}
