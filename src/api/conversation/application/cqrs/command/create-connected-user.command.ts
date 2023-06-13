import { UserEntity } from '../../../../user/domain/entities/user.entity';

export class CreateConnectedUserCommand {
  public readonly socketId: string;
  public readonly user: UserEntity;

  constructor(partial: Partial<CreateConnectedUserCommand>) {
    Object.assign(this, partial);
  }
}
