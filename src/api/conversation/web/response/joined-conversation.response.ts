import { ProfileResponse } from '../../../profile/web/response/profile.response';

export class JoinedConversationResponse {
  public readonly id: string;
  public readonly profile: ProfileResponse;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<JoinedConversationResponse>) {
    Object.assign(this, partial);
  }
}
