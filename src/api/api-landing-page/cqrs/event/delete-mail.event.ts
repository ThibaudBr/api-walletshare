import { DeleteMailCommand } from '../command/delete-mail.command';

export class DeleteMailEvent {
  constructor(
    public readonly deleteMailDto: DeleteMailCommand,
    public readonly module: string = 'api-landing-page',
    public readonly method: string = 'delete-mail',
  ) {}
}
