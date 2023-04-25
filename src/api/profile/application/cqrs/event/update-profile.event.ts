import { UpdateProfileCommand } from '../command/update-profile.command';

export class UpdateProfileEvent {
  public readonly updateProfileCommand: UpdateProfileCommand;
  public readonly module: string = 'profile';
  public readonly method: string = 'update-profile';
  constructor(partial: Partial<UpdateProfileEvent>) {
    Object.assign(this, partial);
  }
}
