import { UpdateUserDto } from '../../domain/dto/update-user.dto';

export class UpdateUserCommand {
  constructor(public readonly userId: string, public readonly user: UpdateUserDto) {}
}
