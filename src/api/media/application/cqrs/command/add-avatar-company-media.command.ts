import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddAvatarCompanyMediaCommand {
  public readonly companyId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddAvatarCompanyMediaCommand>) {
    Object.assign(this, partial);
  }
}
