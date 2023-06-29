import {MediaEntity} from "../../../media/domain/entities/media.entity";

export class ProfileResponse {
  public readonly id: string;
  public readonly userId?: string;
  public readonly usernameProfile: string;

  public readonly isDeleted?: boolean;

  public readonly roleProfile?: string;
  public readonly avatarMedia?: MediaEntity;
  public readonly bannerMedia?: MediaEntity;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}
