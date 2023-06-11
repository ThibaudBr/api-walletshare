import { UserEntity } from '../../../../user/domain/entities/user.entity';

export class CreateConnectedUserCommand {
  constructor(partial: Partial<CreateConnectedUserCommand>) {
    Object.assign(this, partial);
  }

  public readonly socketId: string;
  public readonly user: UserEntity;
}
