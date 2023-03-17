import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMailCommand } from '../../command/delete-mail.command';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeleteMailEvent } from '../../event/delete-mail.event';

@CommandHandler(DeleteMailCommand)
export class DeleteMailCommandHandler implements ICommandHandler<DeleteMailCommand> {
  constructor(@Inject('API_LANDING_PAGE') private client: ClientProxy, private readonly eventBus: EventBus) {}

  async execute(command: DeleteMailCommand): Promise<void> {
    this.client.emit('delete', command.mail);
    this.eventBus.publish(new DeleteMailEvent(command));
  }
}
