import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendMailEvent } from '../../event/send-mail.event';
import { SendMailCommand } from '../../command/send-mail.command';

@CommandHandler(SendMailCommand)
export class SendMailCommandHandler implements ICommandHandler<SendMailCommand> {
  constructor(@Inject('API_LOG') private client: ClientProxy, private readonly eventBus: EventBus) {}
  async execute(command: SendMailCommand): Promise<void> {
    this.client.emit('send-email', command);
    this.eventBus.publish(
      new SendMailEvent({
        email: command.email,
      }),
    );
  }
}
