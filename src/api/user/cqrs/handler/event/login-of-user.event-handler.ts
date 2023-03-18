import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginOfUserEvent } from '../../event/login-of-user.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(LoginOfUserEvent)
export class LoginOfUserEventHandler implements IEventHandler<LoginOfUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  async handle(event: LoginOfUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with username: ' + event.username + ' logged in',
    });
  }
}
