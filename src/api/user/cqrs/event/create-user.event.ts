import { CreateUserDto } from '../../domain/dto/create-user.dto';

export class CreateUserEvent {
  constructor(
    public readonly module: string = 'user',
    public readonly method: string = 'create-user',
    public readonly userId: string,
    public readonly createUserDto: CreateUserDto,
  ) {}
}
