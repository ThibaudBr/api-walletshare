import { UpdateUserRoleCommand } from '../command/update-user-role.command';

export class UpdateUserRoleEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'update-user-role';
  constructor(public readonly updateUserRoleCommand: UpdateUserRoleCommand) {}
}
