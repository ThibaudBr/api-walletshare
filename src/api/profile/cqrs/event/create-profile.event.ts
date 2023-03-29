import { ProfileResponse } from '../../domain/response/profile.response';

export class CreateProfileEvent {
  public readonly module: string = 'profile';
  public readonly method: string = 'create-profile';
  public readonly profileResponse: ProfileResponse;

  constructor(partial: Partial<CreateProfileEvent>) {
    Object.assign(this, partial);
  }
}
