import { Request } from 'express';
import { UserEntity } from '../../user/domain/entities/user.entity';

export interface RequestUser extends Request {
  user: UserEntity;
}
