import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './cqrs/command/create-user.command';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResponse } from './domain/response/create-user.response';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }
}
