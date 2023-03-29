import { DeleteProfileCommand } from '../command/delete-profile.command';

export class DeleteProfileEvent {
  public readonly module: string = 'profile';
  public readonly method: string = 'delete-profile';
  public readonly deleteProfileCommand: DeleteProfileCommand;

  constructor(partial: Partial<DeleteProfileEvent>) {
    Object.assign(this, partial);
  }
}
