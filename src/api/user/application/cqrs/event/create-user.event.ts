import { CreateUserDto } from '../../../domain/dto/create-user.dto';

export class CreateUserEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'create-user';

  constructor(public readonly userId: string, public readonly createUserDto: CreateUserDto) {}
}
